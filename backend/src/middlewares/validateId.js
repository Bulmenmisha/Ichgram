import mongoose from 'mongoose';

export const validateId = (req, res, next, value, name) => {
    if (!mongoose.isValidObjectId(value)) {
        return res.status(400).json({ message: `Invalid ${name}` });
    }
    next();
}; 