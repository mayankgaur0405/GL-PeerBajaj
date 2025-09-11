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
    sections: { type: [SectionSchema], default: [] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
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

// Export User model
export const User = mongoose.model('User', UserSchema);
