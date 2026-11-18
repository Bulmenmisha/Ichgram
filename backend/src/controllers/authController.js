import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken'; 

export const register = async (req, res) => {
    try {
        const { email, fullName, username, password } = req.body;

        if (!email || !fullName || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }],
        });
        if (existingUser) {
            return res.status(409).json({ message: 'Email or username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            fullName,
            username,
            password: hashedPassword,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration error', error: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).json({ message: 'Login and password are required' });
        }

        const user = await User.findOne({
            $or: [{ email: login.toLowerCase() }, { username: login }],
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid login or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid login or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
};