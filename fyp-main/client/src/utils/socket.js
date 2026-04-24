import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = (token) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinGroup = (groupId) => {
  if (socket) {
    socket.emit('join_group', groupId);
  }
};

export const leaveGroup = (groupId) => {
  if (socket) {
    socket.emit('leave_group', groupId);
  }
};

export const sendPrivateMessage = (recipientId, content, type = 'text') => {
  if (socket) {
    socket.emit('private_message', { recipientId, content, type });
  }
};

export const sendGroupMessage = (groupId, content, type = 'text') => {
  if (socket) {
    socket.emit('group_message', { groupId, content, type });
  }
};

export const markMessageAsRead = (messageId) => {
  if (socket) {
    socket.emit('mark_read', messageId);
  }
};

export const emitTyping = (recipientId, groupId, isTyping) => {
  if (socket) {
    socket.emit('typing', { recipientId, groupId, isTyping });
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  joinGroup,
  leaveGroup,
  sendPrivateMessage,
  sendGroupMessage,
  markMessageAsRead,
  emitTyping,
};
