import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Event listener (optional but useful)
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);

  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

export default connectDB;