import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Resource Schema
const ResourceSchema = new mongoose.Schema(
  {
    img: { type: String, default: '' },         // optional, default empty string
    link: { type: String, required: true },
    description: { type: String, default: '' }  // optional, default empty string
  },
  { _id: true } // each resource gets its own _id
);

// Section Schema
const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    resources: { type: [ResourceSchema], default: [] }
  },
  { _id: true, timestamps: true } // sections also get _id + timestamps
);

// User Schema
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    year: { type: String, default: '' },
    department: { type: String, default: '' },
    specialization: { type: String, default: '' },
    bio: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    coverPicture: { type: String, default: '' },
    sections: { type: [SectionSchema], default: [] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    // Social features
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    
    // Privacy settings
    isPrivate: { type: Boolean, default: false },
    allowMessages: { type: Boolean, default: true },
    
    // Engagement metrics
    totalPosts: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    
    // Trending score for profiles
    trendingScore: { type: Number, default: 0, index: true }
  },
  { 
    timestamps: true,
    indexes: [
      { username: 1 },
      { email: 1 },
      { followers: 1 },
      { trendingScore: -1 }
    ]
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Method to calculate trending score
UserSchema.methods.calculateTrendingScore = function() {
  const followerWeight = this.followers.length * 2;
  const postWeight = this.totalPosts * 1;
  const likeWeight = this.totalLikes * 0.5;
  
  this.trendingScore = followerWeight + postWeight + likeWeight;
  return this.trendingScore;
};

// Static method to get trending users
UserSchema.statics.getTrendingUsers = function(limit = 20) {
  return this.find({ isPrivate: false })
    .sort({ trendingScore: -1, followers: -1 })
    .limit(limit)
    .select('name username profilePicture followers following totalPosts totalLikes bio year department');
};

// Static method to search users with better indexing
UserSchema.statics.searchUsers = function(query, limit = 20) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { username: searchRegex },
      { name: searchRegex },
      { bio: searchRegex }
    ],
    isPrivate: false
  })
  .sort({ followers: -1, trendingScore: -1 })
  .limit(limit)
  .select('name username profilePicture followers following bio year department');
};

// Update trending score before saving
UserSchema.pre('save', function(next) {
  if (this.isModified('followers') || this.isModified('totalPosts') || this.isModified('totalLikes')) {
    this.calculateTrendingScore();
  }
  next();
});

// Export User model
export const User = mongoose.model('User', UserSchema);
