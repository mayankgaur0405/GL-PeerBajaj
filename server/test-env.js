import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('Environment Variables Test:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? '***' + process.env.MONGO_URI.slice(-20) : 'undefined');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'undefined');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'undefined');

// Test Cloudinary configuration
import { v2 as cloudinary } from 'cloudinary';

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  console.log('Cloudinary configuration successful');
  
  // Test a simple API call
  cloudinary.api.ping()
    .then(result => {
      console.log('Cloudinary API test successful:', result);
    })
    .catch(error => {
      console.error('Cloudinary API test failed:', error.message);
    });
    
} catch (error) {
  console.error('Cloudinary configuration failed:', error.message);
}
