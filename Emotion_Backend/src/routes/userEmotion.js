import express from 'express';
import {saveUserEmotion, getUserEmotions, updateEmotionCard, deleteEmotionCard} from '../controllers/userEmoController.js';

const router = express.Router();

router.get('/getUserEmotion/:user_Id', getUserEmotions);

router.post('/saveUserEmotion', saveUserEmotion);

router.patch('/updateEmotionCard/:id', updateEmotionCard);

router.delete('/deleteEmotionCard/:id', deleteEmotionCard)

export default router;