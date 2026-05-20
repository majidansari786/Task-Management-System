const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const user_model = require("../model/User");
const generateToken = require("../middleware/generateToken");
const jwt = require("jsonwebtoken");

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await user_model.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new user_model({ name, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser._id, newUser.role);

    return res
      .status(201)
      .cookie("userAccessToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "User created successfully",
        token,
        user: { id: newUser._id, email: newUser.email, role: newUser.role },
      });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const log_user = await user_model.findOne({ email });
  if (!log_user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, log_user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(log_user._id, log_user.role);
  return res
    .status(200)
    .cookie("userAccessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      message: "User logged in successfully",
      token,
      user: { id: log_user._id, email: log_user.email, role: log_user.role },
    });
}

module.exports = {
  signup,
  login,
};
