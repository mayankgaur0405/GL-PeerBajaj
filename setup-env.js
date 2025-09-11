#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment files for GL PeerBajaj...\n');

// Client environment files
const clientEnvDev = `# Development environment variables
VITE_API_BASE=http://localhost:5000/api
VITE_CLIENT_URL=http://localhost:5173`;

const clientEnvProd = `# Production environment variables
VITE_API_BASE=https://gl-peerbridge.onrender.com/api
VITE_CLIENT_URL=https://gl-peer-bajaj.vercel.app`;

// Server environment files
const serverEnvDev = `# Development environment variables
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gl-peerbajaj
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development`;

const serverEnvProd = `# Production environment variables
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
CLIENT_ORIGIN=https://gl-peer-bajaj.vercel.app
JWT_SECRET=your_production_jwt_secret_key_here
NODE_ENV=production`;

// Create client .env files
try {
  fs.writeFileSync(path.join('client', '.env'), clientEnvDev);
  console.log('✅ Created client/.env');
} catch (err) {
  console.log('❌ Failed to create client/.env:', err.message);
}

try {
  fs.writeFileSync(path.join('client', '.env.production'), clientEnvProd);
  console.log('✅ Created client/.env.production');
} catch (err) {
  console.log('❌ Failed to create client/.env.production:', err.message);
}

// Create server .env files
try {
  fs.writeFileSync(path.join('server', '.env'), serverEnvDev);
  console.log('✅ Created server/.env');
} catch (err) {
  console.log('❌ Failed to create server/.env:', err.message);
}

try {
  fs.writeFileSync(path.join('server', '.env.production'), serverEnvProd);
  console.log('✅ Created server/.env.production');
} catch (err) {
  console.log('❌ Failed to create server/.env.production:', err.message);
}

console.log('\n🎉 Environment setup complete!');
console.log('\n📝 Next steps:');
console.log('1. Update the JWT_SECRET in both server/.env files');
console.log('2. Update the MONGODB_URI in server/.env.production with your MongoDB Atlas connection string');
console.log('3. Run "npm install" in both client and server directories');
console.log('4. Start development with "npm run dev" in both directories');
console.log('\n📖 See ENVIRONMENT_SETUP.md for detailed instructions');
