import { SavedFile } from '../models/File.js';

export async function saveFile(req, res, next) {
  try {
    const userId = req.userId;
    const { roomId, filename, content, visibility = 'private' } = req.body;
    if (!roomId || !filename) return res.status(400).json({ message: 'roomId and filename are required' });

    const doc = await SavedFile.create({ userId, roomId, filename, content: String(content || ''), visibility });
    res.status(201).json({ file: doc });
  } catch (e) { next(e); }
}

export async function getUserFiles(req, res, next) {
  try {
    const { userId } = req.params;
    const requester = req.userId;
    const query = { userId };
    if (String(userId) !== String(requester)) {
      query.visibility = 'public';
    }
    const files = await SavedFile.find(query).sort({ createdAt: -1 });
    res.json({ files });
  } catch (e) { next(e); }
}

export async function updateVisibility(req, res, next) {
  try {
    const { fileId } = req.params;
    const { visibility } = req.body;
    if (!['private','public'].includes(visibility)) return res.status(400).json({ message: 'Invalid visibility' });
    const doc = await SavedFile.findOneAndUpdate({ _id: fileId, userId: req.userId }, { visibility }, { new: true });
    if (!doc) return res.status(404).json({ message: 'File not found' });
    res.json({ file: doc });
  } catch (e) { next(e); }
}


