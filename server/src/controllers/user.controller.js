import mongoose from 'mongoose';
import { User } from '../models/User.js';

export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
    const user = await User.findById(id).select('-password').populate('followers following', 'name username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function searchUsers(req, res, next) {
  try {
    const { username } = req.query;
    if (!username) return res.json({ users: [] });
    const users = await User.find({ username: new RegExp(username, 'i') }).select('name username year department specialization bio');
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function filterUsers(req, res, next) {
  try {
    const { year, department, specialization } = req.body;
    const query = {};
    if (year) query.year = year;
    if (department) query.department = department;
    if (specialization) query.specialization = specialization;
    const users = await User.find(query).select('name username year department specialization bio');
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function suggestUsers(req, res, next) {
  try {
    const count = await User.countDocuments();
    const limit = Math.min(parseInt(req.query.limit) || 8, 20);
    const skip = Math.max(Math.floor(Math.random() * Math.max(count - limit, 0)), 0);
    const users = await User.find({}).skip(skip).limit(limit).select('name username year department specialization bio');
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function followUser(req, res, next) {
  try {
    const { id } = req.params; // target
    if (id === req.userId) return res.status(400).json({ message: 'Cannot follow yourself' });
    const me = await User.findById(req.userId);
    const target = await User.findById(id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    if (me.following.includes(id)) return res.status(400).json({ message: 'Already following' });
    me.following.push(id);
    target.followers.push(me._id);
    await me.save();
    await target.save();
    res.json({ message: 'Followed' });
  } catch (err) {
    next(err);
  }
}

export async function unfollowUser(req, res, next) {
  try {
    const { id } = req.params;
    const me = await User.findById(req.userId);
    const target = await User.findById(id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    me.following = me.following.filter((uid) => uid.toString() !== id);
    target.followers = target.followers.filter((uid) => uid.toString() !== req.userId);
    await me.save();
    await target.save();
    res.json({ message: 'Unfollowed' });
  } catch (err) {
    next(err);
  }
}

export async function upsertSections(req, res, next) {
  try {
    const { id } = req.params;
    if (id !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    const { sections } = req.body;
    const user = await User.findByIdAndUpdate(id, { sections }, { new: true }).select('-password');
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function addSection(req, res, next) {
  try {
    const { id } = req.params; // user id
    if (id !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    const { title, description } = req.body;
    const user = await User.findById(id);
    user.sections.push({ title, description, resources: [] });
    await user.save();
    res.status(201).json({ sections: user.sections });
  } catch (err) {
    next(err);
  }
}

export async function updateSection(req, res, next) {
  try {
    const { id, sectionId } = req.params;
    if (id !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    const { title, description } = req.body;
    const user = await User.findById(id);
    const section = user.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    if (title !== undefined) section.title = title;
    if (description !== undefined) section.description = description;
    await user.save();
    res.json({ section });
  } catch (err) {
    next(err);
  }
}

export async function deleteSection(req, res, next) {
  try {
    const { id, sectionId } = req.params;
    if (id !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    const user = await User.findById(id);
    const section = user.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    section.remove();
    await user.save();
    res.json({ sections: user.sections });
  } catch (err) {
    next(err);
  }
}

export async function addResource(req, res, next) {
  try {
    const { id, sectionId } = req.params;
    if (id !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    const { img, link, description } = req.body;
    const user = await User.findById(id);
    const section = user.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    section.resources.push({ img, link, description });
    await user.save();
    res.status(201).json({ section });
  } catch (err) {
    next(err);
  }
}

export async function updateResource(req, res, next) {
  try {
    const { id, sectionId, resourceIndex } = req.params;
    if (id !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    const { img, link, description } = req.body;
    const user = await User.findById(id);
    const section = user.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    const idx = parseInt(resourceIndex);
    if (Number.isNaN(idx) || idx < 0 || idx >= section.resources.length) return res.status(400).json({ message: 'Invalid resource index' });
    const resource = section.resources[idx];
    if (img !== undefined) resource.img = img;
    if (link !== undefined) resource.link = link;
    if (description !== undefined) resource.description = description;
    await user.save();
    res.json({ section });
  } catch (err) {
    next(err);
  }
}

export async function deleteResource(req, res, next) {
  try {
    const { id, sectionId, resourceIndex } = req.params;
    if (id !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    const user = await User.findById(id);
    const section = user.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    const idx = parseInt(resourceIndex);
    if (Number.isNaN(idx) || idx < 0 || idx >= section.resources.length) return res.status(400).json({ message: 'Invalid resource index' });
    section.resources.splice(idx, 1);
    await user.save();
    res.json({ section });
  } catch (err) {
    next(err);
  }
}


