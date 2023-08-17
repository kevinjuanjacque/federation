import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGO, {});
    console.log('DB Connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
