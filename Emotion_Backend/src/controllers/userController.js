import User from '../models/User.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
export const userRegister = async (req, res) => {
  try{
    const { name, email, password, location, profileImage } = req.body;
    // Check if user already exists
    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists'});
    }
    // Upload image to Cloudinary
    let uploaded_profile_Image;
    if (profileImage) {
            const result = await uploadImage(profileImage, "user_dp_Emotion"); // base64 data bhejna hai
            uploaded_profile_Image = result.secure_url; // Cloudinary se URL milta hai
            if (result.error) {
              return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
            }
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
      email,
      password: hashedPassword,
      location,
      profileImage: uploaded_profile_Image || null,
    }); 

    // Save the user to the database
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: {
        Name: newUser.name,
        email: newUser.email,
      },
    });
  }catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const userLogin = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    //Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //Streak logic
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignore time part

    if (user.lastLoginDate) {
      const lastLogin = new Date(user.lastLoginDate);
      lastLogin.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.currentStreak += 1; // continue streak
      } else if (diffDays > 1) {
        user.currentStreak = 1; // reset streak
      }
      // same day login -> streak unchanged
    } else {
      user.currentStreak = 1;
    }

    //Update highest streak
    if (user.currentStreak > user.highestStreak) {
      user.highestStreak = user.currentStreak;
    }

    //Update last login date
    user.lastLoginDate = today;

    //Milestone message
    let milestoneMessage = `💪 You’ve logged in for ${user.currentStreak} days in a row!`;

    if (user.currentStreak === 5)
      milestoneMessage = "🔥 5 days in a row! Great job!";
    else if (user.currentStreak === 10)
      milestoneMessage = "💯 10 days without missing! Amazing!";
    else if (user.currentStreak % 30 === 0 && user.currentStreak !== 0)
      milestoneMessage = `🌟 ${user.currentStreak} days in a row! You're unstoppable!`;
    
    user.rememberMe = rememberMe;
    await user.save();

    //Generate JWT token
    const token = jwt.sign({ id: user._id,name: user.name, project: "EmoTacker"}, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? "7d" : "1d", 
    });

    // Return response
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        user_Id: user._id,
        Name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        location: user.location,  
        streak: user.currentStreak,
        highestStreak: user.highestStreak,
        milestoneMessage,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error.message });
  }
}