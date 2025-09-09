import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb+srv://mayankgaur1504:GLConnectfzkkd45@cluster0.upmsgu1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: true
  });
  console.log('MongoDB connected');
}


