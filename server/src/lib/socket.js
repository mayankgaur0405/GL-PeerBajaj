import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Chat } from '../models/Chat.js';
import { Notification } from '../models/Notification.js';

// Store active users
const activeUsers = new Map();

export function setupSocketHandlers(io) {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('name username profilePicture isOnline');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected with socket ${socket.id}`);
    
    // Add user to active users
    activeUsers.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      lastSeen: new Date()
    });

    // Update user online status
    User.findByIdAndUpdate(socket.userId, { 
      isOnline: true, 
      lastSeen: new Date() 
    }).exec();

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Handle joining chat rooms
    socket.on('join_chat', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        // Check if user is participant
        const isParticipant = chat.participants.some(
          participant => participant.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to join this chat' });
          return;
        }

        socket.join(`chat_${chatId}`);
        socket.emit('joined_chat', { chatId });
      } catch (err) {
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Handle leaving chat rooms
    socket.on('leave_chat', (chatId) => {
      socket.leave(`chat_${chatId}`);
      socket.emit('left_chat', { chatId });
    });

    // Handle new messages
    socket.on('send_message', async (data) => {
      try {
        const { chatId, content, type = 'text', media } = data;

        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        // Check if user is participant
        const isParticipant = chat.participants.some(
          participant => participant.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit('error', { message: 'Not authorized to send messages in this chat' });
          return;
        }

        // Add message to chat
        await chat.addMessage(socket.userId, content, type, media);

        // Get the other participant
        const otherParticipant = chat.participants.find(
          participant => participant.toString() !== socket.userId
        );

        // Create notification for new message
        await Notification.createNotification({
          receiverId: otherParticipant,
          senderId: socket.userId,
          type: 'chat',
          chatId: chat._id,
          metadata: {
            message: content.length > 50 ? content.substring(0, 50) + '...' : content
          }
        });

        // Populate the message data
        await chat.populate('messages.sender', 'name username profilePicture');

        const newMessage = chat.messages[chat.messages.length - 1];

        // Emit to all participants in the chat
        io.to(`chat_${chatId}`).emit('new_message', {
          chatId,
          message: newMessage
        });

        // Emit notification to the other participant
        if (otherParticipant) {
          io.to(`user_${otherParticipant}`).emit('new_notification', {
            type: 'chat',
            message: 'New message received'
          });
        }

      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { chatId } = data;
      socket.to(`chat_${chatId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.user.username,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      const { chatId } = data;
      socket.to(`chat_${chatId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.user.username,
        isTyping: false
      });
    });

    // Handle post likes
    socket.on('post_liked', async (data) => {
      try {
        const { postId, postAuthorId } = data;

        // Emit to post author if they're online
        if (postAuthorId !== socket.userId) {
          io.to(`user_${postAuthorId}`).emit('post_liked', {
            postId,
            likedBy: {
              id: socket.userId,
              name: socket.user.name,
              username: socket.user.username
            }
          });

          // Emit notification
          io.to(`user_${postAuthorId}`).emit('new_notification', {
            type: 'like',
            message: `${socket.user.name} liked your post`
          });
        }
      } catch (err) {
        socket.emit('error', { message: 'Failed to process like' });
      }
    });

    // Handle post comments
    socket.on('post_commented', async (data) => {
      try {
        const { postId, postAuthorId } = data;

        // Emit to post author if they're online
        if (postAuthorId !== socket.userId) {
          io.to(`user_${postAuthorId}`).emit('post_commented', {
            postId,
            commentedBy: {
              id: socket.userId,
              name: socket.user.name,
              username: socket.user.username
            }
          });

          // Emit notification
          io.to(`user_${postAuthorId}`).emit('new_notification', {
            type: 'comment',
            message: `${socket.user.name} commented on your post`
          });
        }
      } catch (err) {
        socket.emit('error', { message: 'Failed to process comment' });
      }
    });

    // Handle new followers
    socket.on('user_followed', async (data) => {
      try {
        const { followedUserId } = data;

        // Emit to followed user if they're online
        if (followedUserId !== socket.userId) {
          io.to(`user_${followedUserId}`).emit('user_followed', {
            followedBy: {
              id: socket.userId,
              name: socket.user.name,
              username: socket.user.username
            }
          });

          // Emit notification
          io.to(`user_${followedUserId}`).emit('new_notification', {
            type: 'follow',
            message: `${socket.user.name} started following you`
          });
        }
      } catch (err) {
        socket.emit('error', { message: 'Failed to process follow' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User ${socket.user.username} disconnected`);
      
      // Remove user from active users
      activeUsers.delete(socket.userId);

      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, { 
        isOnline: false, 
        lastSeen: new Date() 
      }).exec();

      // Notify all chats that user is offline
      socket.broadcast.emit('user_offline', {
        userId: socket.userId,
        username: socket.user.username
      });
    });
  });

  // Helper function to get online users
  io.getOnlineUsers = () => {
    return Array.from(activeUsers.values());
  };

  // Helper function to emit to specific user
  io.emitToUser = (userId, event, data) => {
    io.to(`user_${userId}`).emit(event, data);
  };

  return io;
}
