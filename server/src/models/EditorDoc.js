import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    language: { type: String, default: 'javascript' },
    content: { type: String, default: '' }
  },
  { _id: true }
);

const EditorDocSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true, unique: true },
    files: { type: [FileSchema], default: [] },
    activeFileId: { type: String, default: '' },
    output: { type: String, default: '' }
  },
  { timestamps: true }
);

export const EditorDoc = mongoose.model('EditorDoc', EditorDocSchema);



