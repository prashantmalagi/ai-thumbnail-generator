import { Request, Response } from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

// Controller for User Registration
export const registerUser = async (req: Request, res: Response) => {
    try {
        // 1. Get data from request body
        const { name, email, password } = req.body;

        // 2. Check if user already exists
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // 3. Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // 5. Send response
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};
// Controller for User Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    // 1. Get email & password
    const { email, password } = req.body;

    // 2. Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'User not found'
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // 4. Login success
// 4. Save session
    req.session.iLoggedIn = true;
    req.session.userId = user._id.toString();

    // 5. Login success
    res.status(200).json({
      message: 'Login successful',
      user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};
// Controller for User Logout

export const logoutUser = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
};

// Controller for Getting Current Session User
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};