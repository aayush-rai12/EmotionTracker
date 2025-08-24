// src/routes/userRoutes.js
import express from 'express';
import {userRegister, userLogin} from '../controllers/userController.js';
const router = express.Router();

router.post('/userRegister', userRegister);

router.post('/users', userLogin);

export default router;
