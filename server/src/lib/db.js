import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error('MongoDB connection string is missing. Set MONGODB_URI (or MONGO_URI) in server/.env');
    throw new Error('Missing MongoDB URI');
  }

  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err?.message || err);
    throw err;
  }
}


