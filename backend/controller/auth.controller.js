import userModel from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import { UAParser } from 'ua-parser-js';


// ---------------- Helper Functions -------------------------
const generateToken = (userId, d)=>{
    const token = jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        { expiresIn: `${d}d` }
)
    return token;
}


const setCookies = (res, token, d) => {
    res.cookie("token", token, {
        httpOnly: true,  // Prevent XSS attacks, not accessible by JavaScript
        secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: d * 24 * 60 * 60 * 1000, 
    })
}

const getClientInfo = (req) => {
  const parser = new UAParser(req.headers['user-agent']);
  const ua = parser.getResult();

  return {
    browser: ua.browser.name || "Unknown",
    os: ua.os.name || "Unknown",
    device: ua.device.type || "Unknown"
  };
};


// ---------------- Controller Functions -------------------------


// =============== 1. Register ============================================================
export const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already in use." });
    }

    const newUser = await userModel.create({ userName, email, password });


    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      }
    });

  } catch (err) {
    next(err); // will be caught by errorMiddleware
  }
};


// =============== 2. Login ============================================================
export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const d = rememberMe ? 30 : 7;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // ✅ Select password explicitly for comparison
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }

    const { os, device, browser } = getClientInfo(req);

    const loginDetails = {
      time: new Date(),
      os,
      device,
      browser,
    };

    user.lastLogin = loginDetails;
    user.loginHistory.unshift(loginDetails);
    user.loginHistory = user.loginHistory.slice(0, 10); // ✅ Single slice
    await user.save();

    const token = generateToken(user._id, d);
    setCookies(res, token, d);

    const sanitizedUser = await userModel.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: sanitizedUser
    });

  } catch (err) {
    next(err);
  }
};
