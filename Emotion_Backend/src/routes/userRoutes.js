// src/routes/userRoutes.js
import express from 'express';
const router = express.Router();

router.post('/register', (req, res) => {
  const newUser = req.body;
  // Save user logic
  res.status(201).send(`User ${newUser.name} created`);
});

router.get('/profile', (req, res) => {
  // Return user profile
  res.send('User profile data');
});

export default router;
