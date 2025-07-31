import jwt from 'jsonwebtoken';
import { createResponse } from '../utils/response.js';
import User from '../models/user.model.js';

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(createResponse(false, 'User already exists'));
    }

    const user = await User.create({
      email,
      password,
      name
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json(createResponse(true, 'User created successfully', { email: user.email, name: user.name }));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Error creating user'));
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !password) {
      return res.status(401).json(createResponse(false, 'Invalid credentials'));
    }
    const passwordMatch = await user.comparePassword(password);
    console.log(passwordMatch);
    
    if (!passwordMatch) {
      return res.status(401).json(createResponse(false, 'Invalid credentials'));
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    
    res.cookie('token', token, { httpOnly: true });
    res.json(createResponse(true, 'Login successful', { email: user.email, name: user.name }));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Error during login'));
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json(createResponse(true, 'Logged out successfully'));
};

export const getCurrentUser = (req, res) => {
  res.json(createResponse(true, 'User found', req.user));
}