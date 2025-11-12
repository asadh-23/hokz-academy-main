import User from '../models/userModel.js';
import Tutor from '../models/tutorModel.js';
import Admin from '../models/adminModel.js';
import { verifyAccessToken } from '../utils/generateToken.js';


export const verifyToken = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            token = authHeader.split(' ')[1];
            const decoded = verifyAccessToken(token);

            if (!decoded.id || !decoded.role) {
                return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token payload' });
            }

            let entity;

            if (decoded.role === 'user') {
                entity = await User.findById(decoded.id);
            } else if (decoded.role === 'tutor') {
                entity = await Tutor.findById(decoded.id);
            } else if (decoded.role === 'admin') {
                entity = await Admin.findById(decoded.id);
            } else {
                return res.status(401).json({ success: false, message: 'Unauthorized: Invalid role in token' });
            }

            if (!entity) {
                return res.status(401).json({ success: false, message: 'Unauthorized: User associated with this token not found' });
            }

            if (entity.isBlocked) {
                return res.status(403).json({ success: false, message: 'Forbidden: Your account has been blocked' });
            }

            req.user = entity;
            next();

        } catch (error) {
            console.error('Token verification failed:', error.message);

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Unauthorized: Token has expired' });
            }
            
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }
};

const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, no user data found (Run verifyToken first).' 
            });
        }

        if (req.user.role === role) {
            next();
        } else {
            return res.status(403).json({ 
                success: false, 
                message: `Forbidden. You are not a ${role}. Access denied.` 
            });
        }
    };
};



export const isAdmin = checkRole('admin');

export const isTutor = checkRole('tutor');

export const isUser = checkRole('user'); 

