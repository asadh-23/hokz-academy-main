import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, role) => {
    return jwt.sign({id : userId, role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "20min"});
}

export const generateRefreshToken = (userId, role) => {
    return jwt.sign({id : userId, role}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
}

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};