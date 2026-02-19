import express from 'express';
import { isTutor, verifyToken } from '../../middlewares/authMiddleware.js';
import { getTutorWallet } from '../../controllers/tutor/walletController.js';

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.get("/", getTutorWallet);

export default tutorRouter;