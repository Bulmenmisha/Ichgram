import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoutes.js'; 
import postRoutes from './routes/postRoutes.js'; 
import likeRoutes from './routes/likeRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import followRoutes from './routes/followRoutes.js';  

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: '10mb'}));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/follow', followRoutes);

app.get('/api/health', (req, res) => {
    res.json({status: 'ok'});
});

app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large (max 5MB)' });
    }
    res.status(400).json({ message: err.message || 'Something went wrong' });
});

export default app;
