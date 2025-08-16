import express from 'express';

const router = express.Router();

router.get('/userEmotion', (req, res) => {
  res.send('List of users');
});

router.post('/saveUserEmotion', (req, res) => {
  const newUser = req.body;
  console.log('New user created:', newUser);
  // Logic to save the user in the database
  res.status(201).send(`User ${newUser.name} created`);
});

export default router;