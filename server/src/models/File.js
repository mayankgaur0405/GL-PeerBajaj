import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    roomId: { type: String, required: true, index: true },
    filename: { type: String, required: true },
    content: { type: String, default: '' },
    visibility: { type: String, enum: ['private', 'public'], default: 'private', index: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const SavedFile = mongoose.model('SavedFile', FileSchema);


