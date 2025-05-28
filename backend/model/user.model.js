import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const loginSchema = new Schema({
  time: { type: Date, default: Date.now },
  os: { type: String },
  device: { type: String },
  browser: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  profilePhoto: String,
  bio: { type: String, default: "No bio yet" },

  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],

  registeredAt: { type: Date, default: Date.now },

  lastLogin: {
    time: Date,
    os: String,
    device: String,
    browser: String,
  },

  loginHistory: [loginSchema],
  location: { type: String, maxLength: 100 }

}, { timestamps: true });


// Pre-Save Hook to hash password before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


// who to use in Login Controller: userModel.comparePassword(password)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};



const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
