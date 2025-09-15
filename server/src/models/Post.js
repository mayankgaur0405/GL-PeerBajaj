import mongoose from 'mongoose';

// Comment Schema
const CommentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 1000 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [{
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true, maxlength: 1000 },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      createdAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

// Post Schema
const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { 
      type: String, 
      enum: ['text', 'section', 'image'], 
      required: true,
      index: true 
    },
    title: { type: String, maxlength: 200 },
    content: { type: String, maxlength: 5000 },
    
    // For section/roadmap posts
    section: {
      title: { type: String },
      description: { type: String },
      category: { 
        type: String, 
        enum: ['DSA', 'Web Dev', 'Mobile Dev', 'AI/ML', 'DevOps', 'Data Science', 'Cybersecurity', 'Other'],
        index: true
      },
      resources: [{
        title: { type: String },
        link: { type: String },
        description: { type: String }
      }]
    },
    
    // For image posts
    images: [{
      url: { type: String, required: true },
      publicId: { type: String }, // Cloudinary public ID
      caption: { type: String }
    }],
    
    // Engagement metrics
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
    shares: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      sharedAt: { type: Date, default: Date.now }
    }],
    
    // Trending score calculation
    trendingScore: { type: Number, default: 0, index: true },
    
    // Visibility and status
    isPublic: { type: Boolean, default: true },
    tags: [{ type: String, index: true }]
  },
  { 
    timestamps: true,
    indexes: [
      { author: 1, createdAt: -1 },
      { type: 1, createdAt: -1 },
      { 'section.category': 1, createdAt: -1 },
      { trendingScore: -1, createdAt: -1 },
      { tags: 1, createdAt: -1 }
    ]
  }
);

// Virtual for engagement count
PostSchema.virtual('engagementCount').get(function() {
  return this.likes.length + this.comments.length + this.shares.length;
});

// Method to calculate trending score
PostSchema.methods.calculateTrendingScore = function() {
  const now = new Date();
  const hoursSinceCreation = (now - this.createdAt) / (1000 * 60 * 60);
  
  // Weight recent posts more heavily
  const recencyWeight = Math.max(0.1, 1 - (hoursSinceCreation / 168)); // 1 week decay
  
  const score = (
    this.likes.length * 1 +
    this.comments.length * 2 +
    this.shares.length * 3
  ) * recencyWeight;
  
  this.trendingScore = score;
  return score;
};

// Update trending score before saving
PostSchema.pre('save', function(next) {
  if (this.isModified('likes') || this.isModified('comments') || this.isModified('shares')) {
    this.calculateTrendingScore();
  }
  next();
});

// Static method to get trending posts
PostSchema.statics.getTrendingPosts = function(limit = 20, category = null) {
  const query = { isPublic: true };
  if (category) {
    query['section.category'] = category;
  }
  
  return this.find(query)
    .sort({ trendingScore: -1, createdAt: -1 })
    .limit(limit)
    .populate('author', 'name username profilePicture')
    .populate('comments.author', 'name username')
    .populate('likes', 'name username');
};

// Static method to get feed posts for a user
PostSchema.statics.getFeedPosts = function(userId, page = 1, limit = 10) {
  return this.find({
    $or: [
      { author: userId },
      { author: { $in: [] } } // Will be populated with followed users
    ],
    isPublic: true
  })
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .populate('author', 'name username profilePicture')
  .populate('comments.author', 'name username')
  .populate('likes', 'name username');
};

export const Post = mongoose.model('Post', PostSchema);
