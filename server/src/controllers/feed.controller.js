import { Post } from '../models/Post.js';
import { User } from '../models/User.js';

// Get following feed (posts from users you follow)
export const getFollowingFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, type } = req.query;

    const user = await User.findById(userId).select('following');
    const followingIds = user.following || [];

    if (followingIds.length === 0) {
      return res.json({
        posts: [],
        hasMore: false,
        currentPage: parseInt(page),
        totalPages: 0
      });
    }

    // Build query
    const query = {
      author: { $in: followingIds },
      isDeleted: { $ne: true }
    };

    if (type) {
      query.type = type;
    }

    const posts = await Post.find(query)
      .populate('author', 'name username profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit) + 1);

    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();

    res.json({
      posts,
      hasMore,
      currentPage: parseInt(page),
      totalPages: Math.ceil(posts.length / limit)
    });
  } catch (error) {
    console.error('Get following feed error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get global feed (posts from all users except current user)
// This ensures users only see posts from others, not their own posts
export const getGlobalFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const currentUserId = req.user._id;

    // Build query - exclude current user's posts
    const query = {
      isDeleted: { $ne: true },
      author: { $ne: currentUserId } // Exclude current user's posts from global feed
    };

    if (type) {
      query.type = type;
    }

    console.log('Global feed query:', {
      currentUserId,
      query,
      page,
      limit
    });

    const posts = await Post.find(query)
      .populate('author', 'name username profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit) + 1);

    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();

    res.json({
      posts,
      hasMore,
      currentPage: parseInt(page),
      totalPages: Math.ceil(posts.length / limit)
    });
  } catch (error) {
    console.error('Get global feed error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
