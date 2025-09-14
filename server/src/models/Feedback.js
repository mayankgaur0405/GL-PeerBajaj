import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    // Basic info
    name: { 
      type: String, 
      required: true, 
      maxlength: 100 
    },
    role: { 
      type: String, 
      required: true, 
      maxlength: 100 
    },
    // Structured feedback fields
    issues: { 
      type: String, 
      maxlength: 1000 
    },
    featureRequest: { 
      type: String, 
      maxlength: 1000 
    },
    nonFunctional: { 
      type: String, 
      maxlength: 1000 
    },
    generalFeedback: { 
      type: String, 
      maxlength: 1000 
    },
    // Technical details
    deviceInfo: { 
      type: String, 
      required: true, 
      maxlength: 200 
    },
    severity: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true 
    },
    // File attachments
    attachments: [{
      filename: { type: String },
      url: { type: String },
      fileType: { type: String }
    }],
    // Legacy fields for backward compatibility
    text: { 
      type: String, 
      maxlength: 500 
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5 
    },
    // Status fields
    isApproved: { 
      type: Boolean, 
      default: false 
    },
    isFeatured: { 
      type: Boolean, 
      default: false 
    },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Resolved', 'Closed'],
      default: 'Pending'
    },
    feedbackType: {
      type: String,
      enum: ['quick', 'technical'],
      default: 'quick',
      index: true
    }
  },
  { 
    timestamps: true 
  }
);

// Index for efficient queries
FeedbackSchema.index({ isApproved: 1, isFeatured: 1, createdAt: -1 });

export const Feedback = mongoose.model('Feedback', FeedbackSchema);

