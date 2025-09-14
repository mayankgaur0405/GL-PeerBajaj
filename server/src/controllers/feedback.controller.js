import mongoose from 'mongoose';
import { Feedback } from '../models/Feedback.js';

// CREATE FEEDBACK
export async function createFeedback(req, res, next) {
  try {
    const { 
      name, 
      role, 
      issues, 
      featureRequest, 
      nonFunctional, 
      generalFeedback, 
      deviceInfo, 
      severity,
      attachments,
      type, // 'quick' or 'technical'
      // Legacy fields
      text, 
      rating 
    } = req.body;
    
    // Validate basic required fields
    if (!name || !role) {
      return res.status(400).json({ 
        message: 'Name and role are required' 
      });
    }

    // Check if at least one feedback field is provided
    const hasFeedback = issues || featureRequest || nonFunctional || generalFeedback || text;
    if (!hasFeedback) {
      return res.status(400).json({ 
        message: 'Please provide at least one type of feedback' 
      });
    }

    // For technical reports, require deviceInfo and severity
    if (type === 'technical') {
      if (!deviceInfo || !severity) {
        return res.status(400).json({ 
          message: 'Device info and severity are required for technical reports' 
        });
      }

      // Validate severity
      const validSeverities = ['Low', 'Medium', 'High', 'Critical'];
      if (!validSeverities.includes(severity)) {
        return res.status(400).json({ 
          message: 'Severity must be one of: Low, Medium, High, Critical' 
        });
      }
    }

    // For quick feedback, set default values if not provided
    const feedbackData = {
      user: req.userId,
      name: name.trim(),
      role: role.trim(),
      // Technical fields (optional for quick feedback)
      deviceInfo: deviceInfo?.trim() || 'Not specified',
      severity: severity || 'Low',
      // Structured feedback fields
      issues: issues?.trim() || '',
      featureRequest: featureRequest?.trim() || '',
      nonFunctional: nonFunctional?.trim() || '',
      generalFeedback: generalFeedback?.trim() || '',
      // File attachments
      attachments: attachments || [],
      // Legacy fields for backward compatibility
      text: text?.trim() || '',
      rating: rating ? parseInt(rating) : null,
      // Type field for filtering
      feedbackType: type || 'quick',
      // Auto-approve feedback for testing
      isApproved: true
    };

    const feedback = new Feedback(feedbackData);
    await feedback.save();
    
    // Populate user data
    await feedback.populate('user', 'name username profilePicture');
    
    const message = type === 'technical' 
      ? 'Thank you for your detailed technical report! It will be reviewed by our development team.'
      : 'Thank you for your quick feedback! It will be reviewed and may be displayed on our platform.';
    
    res.status(201).json({ 
      feedback,
      message
    });
  } catch (err) {
    next(err);
  }
}

// GET APPROVED FEEDBACK
export async function getApprovedFeedback(req, res, next) {
  try {
    const { limit = 10, featured = false, type } = req.query;
    
    let query = { isApproved: true };
    
    // If requesting featured feedback, prioritize featured ones
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Filter by feedback type
    if (type === 'quick') {
      query.feedbackType = 'quick';
    } else if (type === 'technical') {
      query.feedbackType = 'technical';
    }
    
    const feedback = await Feedback.find(query)
      .populate('user', 'name username profilePicture')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(parseInt(limit));
    
    console.log('Query:', query);
    console.log('Found feedback count:', feedback.length);
    console.log('Feedback types:', feedback.map(f => ({ id: f._id, type: f.feedbackType, approved: f.isApproved })));
    
    res.json({ feedback });
  } catch (err) {
    next(err);
  }
}

// GET ALL FEEDBACK (ADMIN ONLY)
export async function getAllFeedback(req, res, next) {
  try {
    const { page = 1, limit = 20, approved } = req.query;
    
    let query = {};
    if (approved !== undefined) {
      query.isApproved = approved === 'true';
    }
    
    const feedback = await Feedback.find(query)
      .populate('user', 'name username profilePicture')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Feedback.countDocuments(query);
    
    res.json({ 
      feedback,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (err) {
    next(err);
  }
}

// UPDATE FEEDBACK STATUS (ADMIN ONLY)
export async function updateFeedbackStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { isApproved, isFeatured } = req.body;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid feedback ID' });
    }

    const updateData = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const feedback = await Feedback.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).populate('user', 'name username profilePicture');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ feedback });
  } catch (err) {
    next(err);
  }
}

// DELETE FEEDBACK (ADMIN ONLY)
export async function deleteFeedback(req, res, next) {
  try {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid feedback ID' });
    }

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    next(err);
  }
}

