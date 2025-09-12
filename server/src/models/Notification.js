import mongoose from 'mongoose';

// Notification Schema
const NotificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
      type: String, 
      enum: ['like', 'comment', 'follow', 'share', 'chat', 'mention'], 
      required: true,
      index: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    
    // Related entities
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: mongoose.Schema.Types.ObjectId },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    
    // Status
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    
    // Additional data
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { 
    timestamps: true,
    indexes: [
      { recipient: 1, isRead: 1, createdAt: -1 },
      { recipient: 1, type: 1, createdAt: -1 }
    ]
  }
);

// Static method to create notification
NotificationSchema.statics.createNotification = async function(data) {
  const {
    recipient,
    sender,
    type,
    title,
    message,
    post = null,
    comment = null,
    chat = null,
    metadata = {}
  } = data;
  
  // Don't create notification if user is notifying themselves
  if (recipient.toString() === sender.toString()) {
    return null;
  }
  
  const notification = new this({
    recipient,
    sender,
    type,
    title,
    message,
    post,
    comment,
    chat,
    metadata
  });
  
  return await notification.save();
};

// Static method to get user notifications
NotificationSchema.statics.getUserNotifications = function(userId, page = 1, limit = 20, unreadOnly = false) {
  const query = { recipient: userId };
  if (unreadOnly) {
    query.isRead = false;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('sender', 'name username profilePicture')
    .populate('post', 'title type')
    .populate('chat', 'participants');
};

// Static method to mark notifications as read
NotificationSchema.statics.markAsRead = function(userId, notificationIds = null) {
  const query = { recipient: userId };
  if (notificationIds) {
    query._id = { $in: notificationIds };
  }
  
  return this.updateMany(query, { 
    isRead: true, 
    readAt: new Date() 
  });
};

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ 
    recipient: userId, 
    isRead: false 
  });
};

// Method to mark as read
NotificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

export const Notification = mongoose.model('Notification', NotificationSchema);
