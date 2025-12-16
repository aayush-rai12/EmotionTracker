import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import registerUserChats from '../controllers/chatFeatureController.js';
const router = express.Router();

router.get('/registerUserChats/:user_Id', verifyToken, registerUserChats);

export default router;