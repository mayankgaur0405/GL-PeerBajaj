import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ResourceSchema = new mongoose.Schema(
  {
    img: { type: String },
    link: { type: String, required: true },
    description: { type: String }
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    resources: { type: [ResourceSchema], default: [] }
  },
  { _id: true, timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    year: { type: String },
    department: { type: String },
    specialization: { type: String },
    bio: { type: String },
    sections: { type: [SectionSchema], default: [] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', UserSchema);


