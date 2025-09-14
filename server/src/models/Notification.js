import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['new_follower', 'new_post', 'like', 'comment', 'mention', 'chat'],
      required: true
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: function() {
        return ['new_post', 'like', 'comment', 'mention'].includes(this.type);
      }
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: function() {
        return this.type === 'chat';
      }
    },
    readStatus: {
      type: Boolean,
      default: false
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    indexes: [
      { receiverId: 1, readStatus: 1 },
      { receiverId: 1, createdAt: -1 },
      { senderId: 1, type: 1 }
    ]
  }
);

// Static method to get user notifications
NotificationSchema.statics.getUserNotifications = function(userId, page = 1, limit = 20) {
  return this.find({ receiverId: userId })
    .populate('senderId', 'name username profilePicture')
    .populate('postId', 'title content type')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ receiverId: userId, readStatus: false });
};

// Static method to mark all as read
NotificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { receiverId: userId, readStatus: false },
    { readStatus: true }
  );
};

// Static method to create notification
NotificationSchema.statics.createNotification = function(data) {
  return this.create(data);
};

export const Notification = mongoose.model('Notification', NotificationSchema);