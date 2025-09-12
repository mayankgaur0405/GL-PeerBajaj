import mongoose from 'mongoose';
import { User } from '../models/User.js';

// GET USER BY ID
export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid id' });
    const user = await User.findById(id)
      .select('-password')
      .populate('followers following', 'name username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// SEARCH USERS
export async function searchUsers(req, res, next) {
  try {
    const { username } = req.query;
    if (!username) return res.json({ users: [] });
    const users = await User.find({ username: new RegExp(username, 'i') }).select(
      'name username year department specialization bio'
    );
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

// FILTER USERS
export async function filterUsers(req, res, next) {
  try {
    const { year, department, specialization } = req.body;
    const query = {};
    if (year) query.year = year;
    if (department) query.department = department;
    if (specialization) query.specialization = specialization;
    const users = await User.find(query).select(
      'name username year department specialization bio'
    );
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

// SUGGEST USERS
export async function suggestUsers(req, res, next) {
  try {
    const count = await User.countDocuments();
    if (count === 0) return res.json({ users: [] });

    let limit = parseInt(req.query.limit);
    if (isNaN(limit) || limit <= 0) limit = 8;
    limit = Math.min(limit, 20);

    const skip = Math.floor(Math.random() * Math.max(count - limit, 0));
    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .select('name username year department specialization bio');
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

// FOLLOW USER
export async function followUser(req, res, next) {
  try {
    const { id } = req.params;
    if (id === req.userId)
      return res.status(400).json({ message: 'Cannot follow yourself' });
    const me = await User.findById(req.userId);
    const target = await User.findById(id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    if (me.following.includes(id))
      return res.status(400).json({ message: 'Already following' });
    me.following.push(id);
    target.followers.push(me._id);
    await me.save();
    await target.save();
    res.json({ message: 'Followed' });
  } catch (err) {
    next(err);
  }
}

// UNFOLLOW USER
export async function unfollowUser(req, res, next) {
  try {
    const { id } = req.params;
    const me = await User.findById(req.userId);
    const target = await User.findById(id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    me.following = me.following.filter((uid) => uid.toString() !== id);
    target.followers = target.followers.filter(
      (uid) => uid.toString() !== req.userId
    );
    await me.save();
    await target.save();
    res.json({ message: 'Unfollowed' });
  } catch (err) {
    next(err);
  }
}

// UPSERT SECTIONS
// Sections feature removed

// ADD SECTION
// Sections feature removed

// DELETE SECTION
// Sections feature removed

// ADD RESOURCE
// Sections feature removed

// UPDATE SECTION
// Sections feature removed

// UPDATE RESOURCE
// Sections feature removed

// DELETE RESOURCE
// Sections feature removed

// UPDATE USER
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (id !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    const { name, username, year, department, specialization, bio } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (year !== undefined) user.year = year;
    if (department !== undefined) user.department = department;
    if (specialization !== undefined) user.specialization = specialization;
    if (bio !== undefined) user.bio = bio;
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
