import express from 'express';
import {saveUserEmotion, getUserEmotions, updateEmotionCard, deleteEmotionCard, updateSupport} from '../controllers/userEmoController.js';

const router = express.Router();

router.get('/getUserEmotion/:user_Id', getUserEmotions);

router.post('/saveUserEmotion', saveUserEmotion);

router.patch('/updateEmotionCard/:id', updateEmotionCard);

router.delete('/deleteEmotionCard/:id', deleteEmotionCard)

router.patch('/updateSupport/:id', updateSupport);

export default router;