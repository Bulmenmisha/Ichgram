import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; 

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: '10mb'}));
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({status: 'ok'});
});

export default app;
