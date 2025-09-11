# Environment Setup Guide

This guide will help you configure your GL PeerBajaj project to work in both development and production modes.

## URLs
- **Client (Production)**: https://gl-peer-bajaj.vercel.app/
- **Server (Production)**: https://gl-peerbridge.onrender.com

## Environment Configuration

### Client Environment Variables

Create a `.env` file in the `client/` directory:

#### Development (.env)
```env
VITE_API_BASE=http://localhost:5000/api
VITE_CLIENT_URL=http://localhost:5173
```

#### Production (.env.production)
```env
VITE_API_BASE=https://gl-peerbridge.onrender.com/api
VITE_CLIENT_URL=https://gl-peer-bajaj.vercel.app
```

### Server Environment Variables

Create a `.env` file in the `server/` directory:

#### Development (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gl-peerbajaj
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

#### Production (.env.production)
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
CLIENT_ORIGIN=https://gl-peer-bajaj.vercel.app
JWT_SECRET=your_production_jwt_secret_key_here
NODE_ENV=production
```

## Deployment Configuration

### Vercel (Client)
The client is configured to automatically use the production server URL when deployed to Vercel. The `vercel.json` file includes the environment variable:
```json
{
  "env": {
    "VITE_API_BASE": "https://gl-peerbridge.onrender.com/api"
  }
}
```

### Render (Server)
Make sure to set these environment variables in your Render dashboard:
- `CLIENT_ORIGIN`: `https://gl-peer-bajaj.vercel.app`
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Your production JWT secret
- `NODE_ENV`: `production`

## Running Locally

### Development Mode
1. Start the server:
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. Start the client:
   ```bash
   cd client
   npm install
   npm run dev
   ```

The client will automatically connect to `http://localhost:5000/api` in development mode.

### Production Mode (Local Testing)
1. Set environment variables for production mode
2. Build and run the client:
   ```bash
   cd client
   npm run build
   npm run preview
   ```

## How It Works

The application automatically detects the environment:

- **Development**: Uses `http://localhost:5000/api` for API calls
- **Production**: Uses `https://gl-peerbridge.onrender.com/api` for API calls

The CORS configuration on the server allows requests from both localhost (development) and the Vercel domain (production).

## Troubleshooting

1. **CORS Errors**: Make sure your server's CORS configuration includes your client URL
2. **API Connection Issues**: Check that the `VITE_API_BASE` environment variable is set correctly
3. **Environment Variables**: Ensure `.env` files are created in the correct directories
4. **Build Issues**: Make sure to run `npm run build` before deploying to Vercel
