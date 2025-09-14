#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envContent = `# Database
MONGODB_URI=mongodb://localhost:27017/gl-peer-bajaj

# JWT Secrets
JWT_ACCESS_SECRET=your-access-secret-key-here-${Date.now()}
JWT_REFRESH_SECRET=your-refresh-secret-key-here-${Date.now()}

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dg3lz4gdd
CLOUDINARY_API_KEY=196621614327521
CLOUDINARY_API_SECRET=nqk2ZUFPcYHn9i-6p1yt4lKKGow

# Server Configuration
PORT=5000
NODE_ENV=development

# Client Origin (for CORS)
CLIENT_ORIGIN=http://localhost:5173
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📁 Location:', envPath);
  console.log('🔑 Cloudinary credentials configured');
  console.log('🔐 JWT secrets generated');
  console.log('\n🚀 You can now restart your server with: npm run dev');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📝 Please create a .env file manually in the server directory with the following content:');
  console.log(envContent);
}


