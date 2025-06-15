import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB);
    console.log(`Database Connected : ${connect.connection.host}`);
  } catch (error) {
    console.log(`Database Connection Error : ${error}`);
  }
};

export default connectDB;
