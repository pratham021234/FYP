const Notification = require('../models/Notification.model');

// Create notification
exports.createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Send notification via Socket.IO
exports.sendSocketNotification = (io, userId, notification) => {
  io.to(userId.toString()).emit('notification', notification);
};

// Create and send notification
exports.notifyUser = async (io, data) => {
  const notification = await exports.createNotification(data);
  if (notification && io) {
    exports.sendSocketNotification(io, data.recipient, notification);
  }
  return notification;
};

// Bulk notify users
exports.notifyMultipleUsers = async (io, recipients, notificationData) => {
  const notifications = [];
  
  for (const recipientId of recipients) {
    const notification = await exports.notifyUser(io, {
      ...notificationData,
      recipient: recipientId
    });
    if (notification) {
      notifications.push(notification);
    }
  }
  
  return notifications;
};
