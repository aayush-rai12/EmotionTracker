import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './src/config/db.js';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/userRoutes.js';
import emotionRoutes from './src/routes/userEmotion.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Emotion Tracker Backend is running');
});

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/userEmotion', emotionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
