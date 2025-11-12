import express from 'express';
import {
    getAllUsers,
    blockUser,
    unblockUser
} from '../../controllers/admin/userManagementController.js';

import { verifyToken, isAdmin } from '../../middlewares/authMiddleware.js';

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get('/users', getAllUsers);

adminRouter.patch('/users/:userId/block', blockUser);

adminRouter.patch('/users/:userId/unblock', unblockUser);

export default adminRouter;