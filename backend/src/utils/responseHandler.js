import { generateAccessToken, generateRefreshToken } from "./generateToken.js";

export const setAuthTokens = (res, entity) => {

    const refreshToken = generateRefreshToken(entity._id, entity.role);
    const accessToken = generateAccessToken(entity._id, entity.role);
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-site cookies in production
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return accessToken;
};
