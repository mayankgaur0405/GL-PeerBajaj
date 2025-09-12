import { upload } from '../lib/cloudinary.js';

// Upload single image
export const uploadSingle = upload.single('image');

// Upload multiple images
export const uploadMultiple = upload.array('images', 5);

// Handle single image upload
export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    res.json({
      success: true,
      image: {
        url: req.file.path,
        publicId: req.file.filename,
        secureUrl: req.file.secure_url
      }
    });
  } catch (err) {
    next(err);
  }
}

// Handle multiple image upload
export async function uploadImages(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      secureUrl: file.secure_url
    }));

    res.json({
      success: true,
      images
    });
  } catch (err) {
    next(err);
  }
}
