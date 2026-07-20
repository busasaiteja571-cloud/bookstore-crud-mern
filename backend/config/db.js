import mongoose from 'mongoose';
// This is an async function because connecting to a remote database
// over the network is not instant — we must wait for it to finish
// before the server can safely handle requests that touch the DB.
export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI?.trim();
    
    if (!uri) {
      throw new Error("MONGO_URI is not defined in your .env file");
      process.exit(1);
    }
    // mongoose.connect() returns a Promise. Awaiting it pauses this
    // function until the connection succeeds or throws an error.
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    // If the connection fails (bad password, IP not whitelisted, etc.),
    // log the reason and exit the process — there's no point running
    // a server that can't reach its database.
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;