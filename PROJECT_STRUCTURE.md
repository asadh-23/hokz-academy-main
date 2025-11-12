# 📁 Project Folder Structure

## 🎯 Root Level
```
├── backend/                 # Node.js + Express Backend
├── frontend/                # React + Vite Frontend
├── .gitignore
└── README.md
```

---

## 🔙 Backend Structure (`backend/`)

```
backend/
├── src/
│   ├── app.js                          # Main Express app configuration
│   ├── server.js                       # Server entry point
│   │
│   ├── config/                         # Configuration files
│   │   ├── database.js                 # Database connection
│   │   └── cloudinary.js               # Cloudinary config
│   │
│   ├── controllers/                    # Request handlers
│   │   ├── authController.js           # Shared auth logic
│   │   ├── user/
│   │   │   ├── authController.js       # User authentication
│   │   │   └── profileController.js    # User profile management
│   │   ├── tutor/
│   │   │   ├── authController.js       # Tutor authentication
│   │   │   └── profileController.js    # Tutor profile management
│   │   └── admin/
│   │       ├── authController.js       # Admin authentication
│   │       └── profileController.js    # Admin management
│   │
│   ├── middleware/                     # Express middleware
│   │   ├── authMiddleware.js           # JWT authentication
│   │   ├── errorHandler.js             # Error handling
│   │   └── uploadMiddleware.js         # File upload handling
│   │
│   ├── models/                         # Database models (Sequelize)
│   │   ├── User.js                     # User model
│   │   ├── Tutor.js                    # Tutor model
│   │   ├── Admin.js                    # Admin model
│   │   ├── Course.js                   # Course model
│   │   ├── Category.js                 # Category model
│   │   └── Otp.js                      # OTP model
│   │
│   ├── routes/                         # API routes
│   │   ├── user/
│   │   │   ├── authRoutes.js           # /user/auth/* routes
│   │   │   └── profileRoutes.js        # /user/* routes (protected)
│   │   ├── tutor/
│   │   │   ├── authRoutes.js           # /tutor/auth/* routes
│   │   │   └── profileRoutes.js        # /tutor/* routes (protected)
│   │   └── admin/
│   │       ├── authRoutes.js           # /admin/auth/* routes
│   │       └── profileRoutes.js        # /admin/* routes (protected)
│   │
│   ├── services/                       # Business logic
│   │   ├── emailService.js             # Email sending (Nodemailer)
│   │   ├── otpService.js               # OTP generation & validation
│   │   └── cloudinaryService.js        # Image upload service
│   │
│   └── utils/                          # Utility functions
│       ├── responseHandler.js          # Standardized API responses
│       ├── tokenUtils.js               # JWT token utilities
│       └── validators.js               # Input validation
│
├── seeders/                            # Database seeders
│   └── adminSeeder.js                  # Create default admin
│
├── .env                                # Environment variables
├── package.json
└── package-lock.json
```

---

## 🎨 Frontend Structure (`frontend/`)

```
frontend/
├── public/
│   └── vite.svg                        # Public assets
│
├── src/
│   ├── main.jsx                        # React entry point
│   ├── App.jsx                         # Main App component
│   ├── App.css
│   ├── index.css
│   │
│   ├── api/                            # Axios instances
│   │   ├── publicAxios.js              # Public API calls
│   │   ├── authAxios.js                # Auth API calls
│   │   ├── userAxios.js                # User API calls
│   │   ├── tutorAxios.js               # Tutor API calls
│   │   ├── adminAxios.js               # Admin API calls
│   │   └── authInterceptors.js         # Token refresh logic
│   │
│   ├── assets/                         # Static assets
│   │   ├── images/
│   │   │   ├── hero-image.jpg
│   │   │   ├── LoginImage.png
│   │   │   ├── default-profile-image.webp
│   │   │   └── ...
│   │   └── icons/
│   │
│   ├── components/                     # Reusable components
│   │   ├── common/                     # Shared components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── PublicHeader.jsx
│   │   │   └── PublicFooter.jsx
│   │   │
│   │   ├── auth/                       # Auth-related components
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── GoogleAuth.jsx
│   │   │   ├── ChangeEmailModal.jsx
│   │   │   └── ChangePasswordModal.jsx
│   │   │
│   │   ├── user/                       # User components
│   │   │   ├── UserHeader.jsx
│   │   │   └── UserFooter.jsx
│   │   │
│   │   ├── tutor/                      # Tutor components
│   │   │   ├── TutorHeader.jsx
│   │   │   ├── TutorSidebar.jsx
│   │   │   ├── TutorFooter.jsx
│   │   │   └── AnimatedChart.jsx
│   │   │
│   │   ├── admin/                      # Admin components
│   │   │   ├── AdminHeader.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AdminFooter.jsx
│   │   │   ├── StudentTable.jsx
│   │   │   ├── StudentRow.jsx
│   │   │   ├── StudentStatsCards.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── AdminAnimatedChart.jsx
│   │   │
│   │   └── course/                     # Course components
│   │       ├── CourseList.jsx
│   │       └── CategoryList.jsx
│   │
│   ├── contexts/                       # React Context
│   │   ├── AuthContext.jsx             # Authentication context
│   │   └── ThemeContext.jsx            # Theme context
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useAuth.js                  # Auth hook
│   │   └── useAxios.js                 # Axios hook
│   │
│   ├── layouts/                        # Layout components
│   │   ├── AuthLayout.jsx              # Auth pages layout
│   │   ├── UserLayout.jsx              # User pages layout
│   │   ├── TutorLayout.jsx             # Tutor pages layout
│   │   └── AdminLayout.jsx             # Admin pages layout
│   │
│   ├── pages/                          # Page components
│   │   ├── Home.jsx                    # Landing page
│   │   │
│   │   ├── home/                       # Home page sections
│   │   │   ├── HeroSection.jsx
│   │   │   ├── AboutSection.jsx
│   │   │   ├── StatsSection.jsx
│   │   │   ├── TestimonialsSection.jsx
│   │   │   └── JoinUsSection.jsx
│   │   │
│   │   ├── common/                     # Shared pages
│   │   │   ├── OtpVerify.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── VerifyEmailChangeOtp.jsx
│   │   │   └── VerifyPasswordChangeOtp.jsx
│   │   │
│   │   ├── error/                      # Error pages
│   │   │   ├── NotFound.jsx            # 404 page
│   │   │   └── Unauthorized.jsx        # 401 page
│   │   │
│   │   ├── user/                       # User pages
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── CourseDetails.jsx
│   │   │   └── auth/
│   │   │       ├── UserLogin.jsx
│   │   │       └── UserRegister.jsx
│   │   │
│   │   ├── tutor/                      # Tutor pages
│   │   │   ├── TutorDashboard.jsx
│   │   │   ├── TutorProfile.jsx
│   │   │   ├── ManageCourses.jsx
│   │   │   ├── AddCourse.jsx
│   │   │   └── auth/
│   │   │       ├── TutorLogin.jsx
│   │   │       └── TutorRegister.jsx
│   │   │
│   │   └── admin/                      # Admin pages
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProfile.jsx
│   │       ├── ManageUsers.jsx
│   │       ├── ManageTutors.jsx
│   │       └── auth/
│   │           └── AdminLogin.jsx
│   │
│   ├── routes/                         # Routing configuration
│   │   ├── AppRoutes.jsx               # Main routes
│   │   ├── PrivateRoute.jsx            # Generic private route
│   │   ├── UserRoute.jsx               # User routes
│   │   ├── TutorRoute.jsx              # Tutor routes
│   │   ├── AdminRoute.jsx              # Admin routes
│   │   └── guards/                     # Route guards
│   │       ├── UserPrivateRoute.jsx
│   │       ├── UserPublicRoute.jsx
│   │       ├── TutorPrivateRoute.jsx
│   │       ├── TutorPublicRoute.jsx
│   │       ├── AdminPrivateRoute.jsx
│   │       └── AdminPublicRoute.jsx
│   │
│   ├── store/                          # Redux store
│   │   ├── store.js                    # Store configuration
│   │   └── features/
│   │       └── auth/
│   │           └── authSlice.js        # Auth state management
│   │
│   ├── styles/                         # Global styles
│   │   ├── global.css
│   │   └── tailwind.css
│   │
│   └── utils/                          # Utility functions
│       ├── constants.js                # App constants
│       ├── formatDate.js               # Date formatting
│       └── validation.js               # Form validation
│
├── .env                                # Environment variables
├── index.html                          # HTML template
├── vite.config.js                      # Vite configuration
├── tailwind.config.js                  # Tailwind CSS config
├── eslint.config.js                    # ESLint config
├── package.json
└── package-lock.json
```

---

## 🔑 Key Features

### Backend
- **Role-based authentication**: User, Tutor, Admin
- **JWT tokens**: Access & Refresh tokens
- **OTP verification**: Email-based OTP
- **File uploads**: Cloudinary integration
- **Database**: PostgreSQL with Sequelize ORM

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **Axios** for API calls with interceptors
- **Sonner** for toast notifications
- **Role-based routing** with route guards

---

## 📝 Route Structure

### Backend API Routes
```
/user/auth/*          → User authentication (public)
/user/*               → User profile (protected)
/tutor/auth/*         → Tutor authentication (public)
/tutor/*              → Tutor profile (protected)
/admin/auth/*         → Admin authentication (public)
/admin/*              → Admin management (protected)
```

### Frontend Routes
```
/                     → Home page
/user/login           → User login
/user/register        → User registration
/user/dashboard       → User dashboard (protected)
/tutor/login          → Tutor login
/tutor/register       → Tutor registration
/tutor/dashboard      → Tutor dashboard (protected)
/admin/login          → Admin login
/admin/dashboard      → Admin dashboard (protected)
```
