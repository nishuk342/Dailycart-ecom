const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt2 = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp,salt2);

    console.log(otp); //For Testing Only

    const newUser = await User.create({ name, email, password: hashedPassword, 
                                otp: hashedOTP, otpExpires:Date.now() + 10 * 60 * 1000 }); // OTP expires in 10 minutes

    if (newUser) {
      
      const message = `
      Welcome to DailyCart!, ${name}. Your OTP for registration is: ${otp}. 
      Please use this OTP to complete your registration process.
      Thank you for choosing DailyCart!
      `;

      await sendEmail(email, "Welcome to DailyCart!- Your OTP for Registration", message);

      res.status(201).json({
        message: "OTP sent successfully"
      });
    }
    else {
      res.status(400).json({ message: "Invalid user data" });
    }

  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

const verifyOTP = async (req, res) => {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const isValid = await bcrypt.compare(otp,user.otp);
    if (!isValid) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    if (user.otpExpires < Date.now()) {
        return res.status(400).json({
            message: "OTP expired"
        });
    }

    user.verified = true;

    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        message: "User verified successfully"
    });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if(!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!existingUser.verified) {
      return res.status(401).json({ message: "Please verify your email first." });
    }

    if (existingUser && (await bcrypt.compare(password, existingUser.password))) {

      res.status(200).json({
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        token: generateToken(existingUser._id)
      });
    }
    else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  }
  catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select('-password'); // Exclude password from the response
    res.status(200).json(allUsers);
  }
  catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

module.exports = { registerUser, verifyOTP, loginUser, getUsers };