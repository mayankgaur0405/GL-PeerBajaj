import mongoose from 'mongoose';
import { Chat } from '../models/Chat.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

// GET USER CHATS
export async function getUserChats(req, res, next) {
  try {
    const { limit = 20 } = req.query;
    
    const chats = await Chat.getUserChats(req.userId, parseInt(limit));
    
    res.json({ chats });
  } catch (err) {
    next(err);
  }
}

// GET OR CREATE CHAT
export async function getOrCreateChat(req, res, next) {
  try {
    const { userId } = req.params;
    
    if (userId === req.userId) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    // Check if target user exists and allows messages
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!targetUser.allowMessages) {
      return res.status(403).json({ message: 'User does not allow messages' });
    }

    const chat = await Chat.findOrCreateChat(req.userId, userId);
    
    res.json({ chat });
  } catch (err) {
    next(err);
  }
}

// GET CHAT MESSAGES
export async function getChatMessages(req, res, next) {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId)
      .populate('participants', 'name username profilePicture')
      .populate('messages.sender', 'name username profilePicture');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      participant => participant._id.toString() === req.userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    // Get messages with pagination
    const messages = chat.messages
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice((page - 1) * limit, page * limit)
      .reverse();

    const total = chat.messages.length;

    res.json({
      chat,
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

// SEND MESSAGE
export async function sendMessage(req, res, next) {
  try {
    const { chatId } = req.params;
    const { content, type = 'text', media } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      participant => participant.toString() === req.userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
    }

    // Add message
    await chat.addMessage(req.userId, content.trim(), type, media);

    // Get the other participant
    const otherParticipant = chat.participants.find(
      participant => participant.toString() !== req.userId
    );

    // Create notification for new message
    await Notification.createNotification({
      recipient: otherParticipant,
      sender: req.userId,
      type: 'chat',
      title: 'New Message',
      message: content.length > 50 ? content.substring(0, 50) + '...' : content,
      chat: chat._id
    });

    // Populate the updated chat
    await chat.populate('participants', 'name username profilePicture');
    await chat.populate('messages.sender', 'name username profilePicture');

    const newMessage = chat.messages[chat.messages.length - 1];

    res.status(201).json({ 
      message: newMessage,
      chat 
    });
  } catch (err) {
    next(err);
  }
}

// MARK MESSAGES AS READ
export async function markMessagesAsRead(req, res, next) {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      participant => participant.toString() === req.userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to mark messages in this chat' });
    }

    await chat.markAsRead(req.userId);

    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    next(err);
  }
}

// DELETE MESSAGE
export async function deleteMessage(req, res, next) {
  try {
    const { chatId, messageId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    message.remove();
    await chat.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// DELETE CHAT
export async function deleteChat(req, res, next) {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      participant => participant.toString() === req.userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to delete this chat' });
    }

    // Mark chat as inactive instead of deleting
    chat.isActive = false;
    await chat.save();

    res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// GET UNREAD MESSAGE COUNT
export async function getUnreadCount(req, res, next) {
  try {
    const chats = await Chat.find({
      participants: req.userId,
      isActive: true
    });

    let unreadCount = 0;
    
    for (const chat of chats) {
      const unreadMessages = chat.messages.filter(
        message => message.sender.toString() !== req.userId && !message.isRead
      );
      unreadCount += unreadMessages.length;
    }

    res.json({ unreadCount });
  } catch (err) {
    next(err);
  }
}
