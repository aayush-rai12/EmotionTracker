import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import {registerUserChats, sendMessage, getChatHistory} from '../controllers/chatFeatureController.js';
const router = express.Router();

router.get('/registerUserChats/:user_Id', verifyToken, registerUserChats);
// router.post('/sendMessage', verifyToken, sendMessage);
router.get('/getChatHistory/:receiverId', verifyToken, getChatHistory);

export default router;