const jwt = require('jsonwebtoken');

const connectedUsers = new Map();

module.exports = (io) => {
  // Authentication middleware for socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);
    
    // Store connected user
    connectedUsers.set(socket.userId, socket.id);
    socket.join(socket.userId);

    // Online status indicator
    socket.on('get_online_users', () => {
      socket.emit('online_users', Array.from(connectedUsers.keys()));
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      connectedUsers.delete(socket.userId);
      
      // Broadcast user offline status
      io.emit('user_offline', socket.userId);
    });
  });

  return io;
};
