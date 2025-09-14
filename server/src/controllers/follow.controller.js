import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { Post } from '../models/Post.js';

// Follow a user
export const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    if (id === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(id);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(currentUserId);

    // Check if already following
    if (currentUser.following.includes(id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add to following and followers
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: id }
    });

    await User.findByIdAndUpdate(id, {
      $addToSet: { followers: currentUserId }
    });

    // Create notification for new follower
    await Notification.createNotification({
      senderId: currentUserId,
      receiverId: id,
      type: 'new_follower'
    });

    // Emit socket event for real-time notification
    if (req.io) {
      req.io.emitToUser(id, 'new_notification', {
        type: 'new_follower',
        senderId: currentUserId,
        senderName: currentUser.name
      });
    }

    // Update trending scores
    await userToFollow.save();
    await currentUser.save();

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const userToUnfollow = await User.findById(id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from following and followers
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: id }
    });

    await User.findByIdAndUpdate(id, {
      $pull: { followers: currentUserId }
    });

    // Update trending scores
    await userToUnfollow.save();
    await currentUser.save();

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove a follower
export const removeFollower = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const followerToRemove = await User.findById(id);

    if (!followerToRemove) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from both sides
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { followers: id }
    });

    await User.findByIdAndUpdate(id, {
      $pull: { following: currentUserId }
    });

    // Update trending scores
    await followerToRemove.save();
    await currentUser.save();

    res.json({ message: 'Successfully removed follower' });
  } catch (error) {
    console.error('Remove follower error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get followers list
export const getFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(id)
      .populate({
        path: 'followers',
        select: 'name username profilePicture bio year department',
        options: {
          skip: (page - 1) * limit,
          limit: parseInt(limit)
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      followers: user.followers,
      totalCount: user.followers.length,
      currentUser: req.user._id.toString() === id
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get following list
export const getFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(id)
      .populate({
        path: 'following',
        select: 'name username profilePicture bio year department',
        options: {
          skip: (page - 1) * limit,
          limit: parseInt(limit)
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      following: user.following,
      totalCount: user.following.length,
      currentUser: req.user._id.toString() === id
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
