const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('YOUR_USERNAME')) {
      console.log('⚠️  MONGODB_URI is not configured in .env file!');
      console.log('   Please update backend/.env with your real MongoDB connection string.');
      console.log('   Server will start but database operations will fail.');
      return;
    }
    const conn = await mongoose.connect('mongodb+srv://aryan:strongpassword@cluster0.y1wr6il.mongodb.net/?appName=Cluster0');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error.message}`);
    console.log('Please make sure your MONGODB_URI in .env is correct.');
    console.log('If you are using MongoDB Atlas, check your username, password, and cluster URL.');
    console.log('Server will start but database operations will fail.');
  }
};

module.exports = connectDB;
