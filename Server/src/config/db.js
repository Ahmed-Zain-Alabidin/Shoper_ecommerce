const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected Successfully`);
  } catch (error) {
    console.error(error);
    // keep the original behavior of exiting on DB connect failure
    process.exit(1);
  }
};

module.exports = connectDB;
