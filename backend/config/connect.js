import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("🚀 MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1); 
    }
};
