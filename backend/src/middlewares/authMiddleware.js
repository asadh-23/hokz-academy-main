import User from '../models/userModel.js';
import Tutor from '../models/tutorModel.js';
import Admin from '../models/adminModel.js';
import { verifyAccessToken } from '../utils/generateToken.js';


export const verifyToken = async (req, res, next) => {
    let token;
    // Get the Authorization header (case-insensitive)
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if header exists and starts with 'Bearer '
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            // Extract the token part (after 'Bearer ')
            token = authHeader.split(' ')[1];

            // Verify the token using the ACCESS_TOKEN_SECRET
            const decoded = verifyAccessToken(token); // This will throw error if invalid/expired

            // Check if token payload has required fields
            if (!decoded.id || !decoded.role) {
                 return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token payload' });
            }

            // --- Find the user based on the role in the token ---
            let entity; // Use 'entity' or 'user' for the variable name

            if (decoded.role === 'user') {
                entity = await User.findById(decoded.id);
            } else if (decoded.role === 'tutor') {
                entity = await Tutor.findById(decoded.id)
            } else if (decoded.role === 'admin') {
                entity = await Admin.findById(decoded.id);
            } else {
                 return res.status(401).json({ success: false, message: 'Unauthorized: Invalid role in token' });
            }

            if (!entity) {
                return res.status(401).json({ success: false, message: 'Unauthorized: User associated with this token not found' });
            }

            // 2. Check if the user/tutor/admin account is blocked
            if (entity.isBlocked) {
                 return res.status(403).json({ success: false, message: 'Forbidden: Your account has been blocked' }); // 403 Forbidden is more appropriate here
            }

            // --- Attach user info to request and proceed ---
            // You can use req.user, req.entity, or req.authData
            req.user = entity; // Common practice
            // req.userId = entity._id; // Optionally attach just the ID
            // req.userRole = entity.role; // Optionally attach just the role

            next(); // All checks passed, proceed to the next middleware or route handler

        } catch (error) {
            // Handle JWT errors (expired, invalid signature, etc.)
            console.error('Token verification failed:', error.message);
             if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Unauthorized: Token has expired' });
             }
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }
    }

    // If no token was found in the header
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }
};

// --- Optional: Role-Specific Middleware ---
// These are useful if certain routes absolutely *must* be accessed only by a specific role.
// Often, the controller logic itself can handle role checks if needed.

export const verifyUserToken = (req, res, next) => {
    verifyToken(req, res, () => { // Call the main verifyToken first
        if (req.user && req.user.role === 'user') {
            next(); // Role matches, proceed
        } else {
            res.status(403).json({ success: false, message: 'Forbidden: Access denied. User role required.' });
        }
    });
};

export const verifyTutorToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && req.user.role === 'tutor') {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Forbidden: Access denied. Tutor role required.' });
        }
    });
};

export const verifyAdminToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) { // Allow multiple admin types if needed
            next();
        } else {
            res.status(403).json({ success: false, message: 'Forbidden: Access denied. Admin role required.' });
        }
    });
};