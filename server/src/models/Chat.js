import mongoose from 'mongoose';

// Message Schema
const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 1000 },
    type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    media: {
      url: { type: String },
      publicId: { type: String },
      filename: { type: String },
      size: { type: Number }
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date }
  },
  { timestamps: true }
);

// Chat Schema
const ChatSchema = new mongoose.Schema(
  {
    participants: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }],
    // Deterministic key for a 1:1 chat pair to enforce uniqueness irrespective of order
    pairKey: { type: String, unique: true, index: true },
    messages: [MessageSchema],
    lastMessage: {
      content: { type: String },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date }
    },
    isActive: { type: Boolean, default: true }
  },
  { 
    timestamps: true,
    indexes: [
      { participants: 1, isActive: 1 },
      { 'lastMessage.timestamp': -1 },
      { participants: 1, 'lastMessage.timestamp': -1 },
      { 'messages.sender': 1, 'messages.isRead': 1 }
    ]
  }
);

// Ensure only 2 participants for 1:1 chat
ChatSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    return next(new Error('Chat must have exactly 2 participants'));
  }
  // compute deterministic pairKey: smallerId_biggerId
  const [a, b] = this.participants.map(id => id.toString()).sort();
  this.pairKey = `${a}_${b}`;
  next();
});

// Method to add a message
ChatSchema.methods.addMessage = function(senderId, content, type = 'text', media = null) {
  const message = {
    sender: senderId,
    content,
    type,
    media,
    isRead: false
  };
  
  this.messages.push(message);
  this.lastMessage = {
    content,
    sender: senderId,
    timestamp: new Date()
  };
  
  return this.save();
};

// Method to mark messages as read
ChatSchema.methods.markAsRead = function(userId) {
  this.messages.forEach(message => {
    if (message.sender.toString() !== userId.toString() && !message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
    }
  });
  return this.save();
};

// Static method to find or create chat between two users
ChatSchema.statics.findOrCreateChat = async function(user1Id, user2Id) {
  const [a, b] = [user1Id.toString(), user2Id.toString()].sort();
  const pairKey = `${a}_${b}`;

  // Use upsert guard to avoid race condition duplicate chats
  const chat = await this.findOneAndUpdate(
    { pairKey },
    {
      $setOnInsert: {
        participants: [a, b],
        pairKey,
        messages: []
      }
    },
    { new: true, upsert: true }
  ).populate('participants', 'name username profilePicture')
   .populate('lastMessage.sender', 'name username');

  return chat;
};

// Static method to get user's chats
ChatSchema.statics.getUserChats = function(userId, limit = 20, skip = 0) {
  return this.find({
    participants: userId,
    isActive: true
  })
  .sort({ 'lastMessage.timestamp': -1 })
  .skip(skip)
  .limit(limit)
  .populate('participants', 'name username profilePicture')
  .populate('lastMessage.sender', 'name username')
  .lean(); // Use lean() for better performance
};

export const Chat = mongoose.model('Chat', ChatSchema);
