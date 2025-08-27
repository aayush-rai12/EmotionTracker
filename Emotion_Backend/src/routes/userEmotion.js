import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import {saveUserEmotion, getUserEmotions, updateEmotionCard, deleteEmotionCard, updateSupport} from '../controllers/userEmoController.js';

const router = express.Router();

router.get('/getUserEmotion/:user_Id', verifyToken, getUserEmotions);

router.post('/saveUserEmotion', verifyToken, saveUserEmotion);

router.patch('/updateEmotionCard/:id', verifyToken, updateEmotionCard);

router.delete('/deleteEmotionCard/:id', verifyToken, deleteEmotionCard)

router.patch('/updateSupport/:id', verifyToken, updateSupport);

export default router;