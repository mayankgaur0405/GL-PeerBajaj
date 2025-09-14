import mongoose from 'mongoose';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

// CREATE POST
export async function createPost(req, res, next) {
  try {
    const { type, title, content, section, images, tags } = req.body;
    
    if (!type || !title) {
      return res.status(400).json({ message: 'Type and title are required' });
    }

    const postData = {
      author: req.userId,
      type,
      title,
      content: content || '',
      tags: tags || []
    };

    // Add type-specific data
    if (type === 'section' && section) {
      postData.section = section;
    }

    if (type === 'image' && images && images.length > 0) {
      postData.images = images;
    }

    const post = new Post(postData);
    await post.save();
    
    // Update user's post count
    await User.findByIdAndUpdate(req.userId, { $inc: { totalPosts: 1 } });
    
    // Create notifications for followers
    const author = await User.findById(req.userId);
    if (author.followers && author.followers.length > 0) {
      const notifications = author.followers.map(followerId => ({
        senderId: req.userId,
        receiverId: followerId,
        type: 'new_post',
        postId: post._id
      }));
      
      await Notification.insertMany(notifications);
      
      // Emit socket events for real-time notifications
      if (req.io) {
        author.followers.forEach(followerId => {
          req.io.emitToUser(followerId, 'new_notification', {
            type: 'new_post',
            senderId: req.userId,
            senderName: author.name,
            postId: post._id
          });
        });
      }
    }
    
    // Populate author data
    await post.populate('author', 'name username profilePicture');
    
    res.status(201).json({ 
      post,
      postId: post._id,
      postType: post.type
    });
  } catch (err) {
    next(err);
  }
}

// GET POSTS WITH FILTERS
export async function getPosts(req, res, next) {
  try {
    const { 
      type, 
      category, 
      author, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isPublic: true };
    
    if (type) query.type = type;
    if (category) query['section.category'] = category;
    if (author) query.author = author;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const posts = await Post.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name username profilePicture')
      .populate('comments.author', 'name username profilePicture')
      .populate('likes', 'name username');

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

// GET FEED POSTS
export async function getFeedPosts(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Get user's following list
    const user = await User.findById(req.userId).select('following');
    const followingIds = user.following;
    
    // Include user's own posts and followed users' posts
    const query = {
      $or: [
        { author: req.userId },
        { author: { $in: followingIds } }
      ],
      isPublic: true
    };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name username profilePicture')
      .populate('comments.author', 'name username profilePicture')
      .populate('likes', 'name username');

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

// GET SINGLE POST
export async function getPost(req, res, next) {
  try {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(id)
      .populate('author', 'name username profilePicture bio')
      .populate('comments.author', 'name username profilePicture')
      .populate('likes', 'name username profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (err) {
    next(err);
  }
}

// UPDATE POST
export async function updatePost(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, section, images, tags } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    // Update fields
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (section !== undefined) post.section = section;
    if (images !== undefined) post.images = images;
    if (tags !== undefined) post.tags = tags;

    await post.save();
    await post.populate('author', 'name username profilePicture');

    res.json({ post });
  } catch (err) {
    next(err);
  }
}

// DELETE POST
export async function deletePost(req, res, next) {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(id);
    
    // Update user's post count
    await User.findByIdAndUpdate(req.userId, { $inc: { totalPosts: -1 } });

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// LIKE/UNLIKE POST
export async function toggleLike(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(likeId => likeId.toString() !== userId);
      await User.findByIdAndUpdate(post.author, { $inc: { totalLikes: -1 } });
    } else {
      // Like
      post.likes.push(userId);
      await User.findByIdAndUpdate(post.author, { $inc: { totalLikes: 1 } });
      
      // Create notification for like
      await Notification.createNotification({
        recipient: post.author,
        sender: userId,
        type: 'like',
        title: 'New Like',
        message: 'Someone liked your post',
        post: post._id
      });
    }

    await post.save();
    
    res.json({ 
      isLiked: !isLiked, 
      likesCount: post.likes.length 
    });
  } catch (err) {
    next(err);
  }
}

// ADD COMMENT
export async function addComment(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      author: req.userId,
      content: content.trim()
    };

    post.comments.push(comment);
    await post.save();

    // Create notification for comment
    await Notification.createNotification({
      recipient: post.author,
      sender: req.userId,
      type: 'comment',
      title: 'New Comment',
      message: 'Someone commented on your post',
      post: post._id,
      comment: post.comments[post.comments.length - 1]._id
    });

    // Populate the new comment
    await post.populate('comments.author', 'name username profilePicture');

    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json({ comment: newComment });
  } catch (err) {
    next(err);
  }
}

// DELETE COMMENT
export async function deleteComment(req, res, next) {
  try {
    const { id, commentId } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// SHARE POST
export async function sharePost(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if already shared by this user
    const alreadyShared = post.shares.some(share => share.user.toString() === userId);
    if (alreadyShared) {
      return res.status(400).json({ message: 'Post already shared' });
    }

    post.shares.push({ user: userId });
    await post.save();

    // Create notification for share
    await Notification.createNotification({
      recipient: post.author,
      sender: userId,
      type: 'share',
      title: 'Post Shared',
      message: 'Someone shared your post',
      post: post._id
    });

    res.json({ 
      message: 'Post shared successfully',
      sharesCount: post.shares.length 
    });
  } catch (err) {
    next(err);
  }
}

// GET TRENDING POSTS
export async function getTrendingPosts(req, res, next) {
  try {
    const { category, limit = 20 } = req.query;

    const posts = await Post.getTrendingPosts(parseInt(limit), category);

    res.json({ posts });
  } catch (err) {
    next(err);
  }
}

// GET USER POSTS
export async function getUserPosts(req, res, next) {
  try {
    const { userId } = req.params;
    const { type, page = 1, limit = 10 } = req.query;

    const query = { author: userId, isPublic: true };
    if (type) query.type = type;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name username profilePicture')
      .populate('comments.author', 'name username profilePicture')
      .populate('likes', 'name username');

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}
