import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRouter from "./routes/userRoutes.js";
import tutorRouter from "./routes/tutorRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));




// Test cookie endpoint
app.get('/test-cookie', (req, res) => {
    console.log('🧪 Test cookie endpoint hit');
    console.log('🍪 Received cookies:', req.cookies);
    
    // Set a test cookie exactly like refreshToken
    res.cookie('testRefreshToken', 'test-jwt-token-value', {
        httpOnly: true,
        secure: false, // Same as development
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ 
        message: 'Test refresh token cookie set', 
        receivedCookies: req.cookies 
    });
});

// Test refresh endpoint
app.post('/test-refresh', (req, res) => {
    console.log('🧪 Test refresh endpoint hit');
    console.log('🍪 Received cookies:', req.cookies);
    
    if (req.cookies.testRefreshToken) {
        res.json({ success: true, message: 'Test refresh token received!' });
    } else {
        res.status(401).json({ success: false, message: 'No test refresh token' });
    }
});

app.use("/api/user", userRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/admin", adminRouter);

app.get('/',(req,res)=>{
    res.send("<h1>Backend server is running</h1>")
});

app.use("/api/auth", authRouter)

export default app;
