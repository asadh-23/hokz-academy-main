# 📁 Project Folder Structure

## 🎯 Root Level
```
├── backend/                            # Node.js + Express Backend
├── frontend/                           # React + Vite Frontend
├── .gitignore
├── README.md
├── PROJECT_STRUCTURE.md
├── REDUX_QUICK_REFERENCE.md
├── REDUX_REFACTOR_COMPLETE_GUIDE.md
└── REDUX_REFACTOR_GUIDE.md
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
│   │   ├── db.js                       # Database connection
│   │   ├── cloudinary.js               # Cloudinary config
│   │   └── aws.js                      # AWS S3 config
│   │
│   ├── constants/                      # Application constants
│   │   ├── configKeys.js               # Configuration keys
│   │   ├── messages.js                 # Response messages
│   │   └── roles.js                    # User roles
│   │
│   ├── controllers/                    # Request handlers
│   │   ├── authController.js           # Shared auth logic
│   │   ├── user/
│   │   │   ├── authController.js       # User authentication
│   │   │   ├── profileController.js    # User profile management
│   │   │   ├── courseController.js     # User course operations
│   │   │   └── paymentController.js    # Payment & coupon operations
│   │   ├── tutor/
│   │   │   ├── authController.js       # Tutor authentication
│   │   │   ├── profileController.js    # Tutor profile management
│   │   │   ├── courseController.js     # Tutor course management
│   │   │   ├── lessonController.js     # Tutor lesson management
│   │   │   └── couponController.js     # Tutor coupon management
│   │   └── admin/
│   │       ├── authController.js       # Admin authentication
│   │       ├── profileController.js    # Admin profile management
│   │       ├── categoryController.js   # Category management
│   │       └── userManagementController.js # User management
│   │
│   ├── middlewares/                    # Express middleware
│   │   ├── authMiddleware.js           # JWT authentication
│   │   ├── errorHandler.js             # Error handling
│   │   ├── multerMiddleware.js         # File upload handling
│   │   ├── courseThumbnailMiddleware.js # Course thumbnail upload
│   │   └── lessonFilesMiddleware.js    # Lesson files upload
│   │
│   ├── models/                         # Database models (MongoDB/Mongoose)
│   │   ├── user/                       # User-related models
│   │   │   ├── User.js                 # User model
│   │   │   ├── Tutor.js                # Tutor model
│   │   │   ├── Admin.js                # Admin model
│   │   │   └── Profile.js              # Profile model
│   │   ├── category/                   # Category models
│   │   │   ├── Category.js             # Category model
│   │   │   └── SubCategory.js          # SubCategory model
│   │   ├── common/                     # Common models
│   │   │   ├── Otp.js                  # OTP model
│   │   │   ├── Notification.js         # Notification model
│   │   │   └── Banner.js               # Banner model
│   │   ├── course/                     # Course models
│   │   │   ├── Course.js               # Course model
│   │   │   ├── Lesson.js               # Lesson model
│   │   │   ├── Section.js              # Section model
│   │   │   ├── Quiz.js                 # Quiz model
│   │   │   ├── QuizQuestion.js         # Quiz question model
│   │   │   ├── Enrollment.js           # Enrollment model
│   │   │   ├── Progress.js             # Progress tracking
│   │   │   └── Certificate.js          # Certificate model
│   │   ├── review/                     # Review models
│   │   │   ├── Review.js               # Review model
│   │   │   ├── Report.js               # Report model
│   │   │   └── TutorResponse.js        # Tutor response model
│   │   └── finance/                    # Finance models
│   │       ├── Order.js                # Order model (enhanced with multiple coupons)
│   │       ├── PaymentDistribution.js  # Payment distribution model
│   │       ├── Wallet.js               # Wallet model
│   │       ├── WalletTransaction.js    # Wallet transaction model
│   │       ├── Transaction.js          # Transaction model
│   │       ├── Payout.js               # Payout model
│   │       └── Revenue.js              # Revenue model
│   │   ├── marketing/                  # Marketing models
│   │   │   ├── Coupon.js               # Coupon model
│   │   │   └── CouponUsage.js          # Coupon usage tracking
│   │
│   ├── routes/                         # API routes
│   │   ├── authRoutes.js               # Shared auth routes
│   │   ├── user/
│   │   │   ├── authRoutes.js           # /user/auth/* routes
│   │   │   ├── profileRoutes.js        # /user/* routes (protected)
│   │   │   ├── courseRoutes.js         # /user/courses/* routes
│   │   │   └── paymentRoutes.js        # /user/payment/* routes (checkout, coupons)
│   │   ├── tutor/
│   │   │   ├── authRoutes.js           # /tutor/auth/* routes
│   │   │   ├── profileRoutes.js        # /tutor/* routes (protected)
│   │   │   ├── courseRoutes.js         # /tutor/courses/* routes
│   │   │   ├── lessonRoutes.js         # /tutor/lessons/* routes
│   │   │   └── couponRoutes.js         # /tutor/coupons/* routes
│   │   └── admin/
│   │       ├── authRoutes.js           # /admin/auth/* routes
│   │       ├── profileRoutes.js        # /admin/* routes (protected)
│   │       ├── categoryRoutes.js       # /admin/categories/* routes
│   │       ├── userManagementRoutes.js # /admin/users/* routes
│   │       ├── tutorManagementRoutes.js # /admin/tutors/* routes
│   │       ├── courseManagementRoutes.js # /admin/courses/* routes
│   │       ├── orderManagementRoutes.js # /admin/orders/* routes
│   │       └── dashboardRoutes.js      # /admin/dashboard/* routes
│   │
│   ├── services/                       # Business logic
│   │   ├── emailService.js             # Email sending (Nodemailer)
│   │   ├── otpService.js               # OTP generation & validation
│   │   ├── cloudinaryService.js        # Cloudinary upload service
│   │   ├── s3UploadService.js          # AWS S3 upload service
│   │   └── paymentService.js           # Payment processing
│   │
│   └── utils/                          # Utility functions
│       ├── responseHandler.js          # Standardized API responses
│       ├── generateToken.js            # JWT token utilities
│       ├── validation.js               # Input validation
│       ├── sendEmail.js                # Email utilities
│       └── videoUtils.js               # Video processing utilities
│
├── seeders/                            # Database seeders
│   └── createSuperAdmin.js             # Create default admin
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
│   ├── api/                            # Axios instances & interceptors
│   │   ├── publicAxios.js              # Public API calls (no auth)
│   │   ├── authAxios.js                # Auth API calls (refresh token)
│   │   ├── userAxios.js                # User API calls (with interceptors)
│   │   ├── tutorAxios.js               # Tutor API calls (with interceptors)
│   │   ├── adminAxios.js               # Admin API calls (with interceptors)
│   │   └── setupInterceptors.js        # Token attachment & 401 handling
│   │
│   ├── assets/                         # Static assets
│   │   ├── react.svg
│   │   ├── images/
│   │   │   ├── hero-image.jpg
│   │   │   ├── LoginImage.png
│   │   │   ├── default-profile-image.webp
│   │   │   ├── aboutImage.png
│   │   │   ├── aboutImage2.png
│   │   │   ├── contactImage.png
│   │   │   ├── notFoundImage.png
│   │   │   ├── CourseImage1.jpg
│   │   │   ├── CourseImage2.jpeg
│   │   │   ├── CourseImage3.jpg
│   │   │   └── CourseImage4.png
│   │   └── icons/                      # Icon assets (empty)
│   │
│   ├── components/                     # Reusable components
│   │   ├── common/                     # Shared components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── PublicHeader.jsx
│   │   │   ├── PublicFooter.jsx
│   │   │   ├── Pagination.jsx          # Reusable pagination
│   │   │   └── StatsCards.jsx          # Statistics cards
│   │   │
│   │   ├── auth/                       # Auth-related components
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── GoogleAuth.jsx
│   │   │   ├── ChangeEmailModal.jsx
│   │   │   └── ChangePasswordModal.jsx
│   │   │
│   │   ├── user/                       # User components
│   │   │   ├── UserHeader.jsx          # Header with sidebar toggle
│   │   │   ├── UserSidebar.jsx         # Toggleable sidebar
│   │   │   ├── UserFooter.jsx
│   │   │   ├── checkout/               # Checkout components
│   │   │   │   ├── PaymentSummary.jsx  # Enhanced checkout with multi-coupon support
│   │   │   │   ├── CouponBrowseModal.jsx # Coupon browsing modal
│   │   │   │   ├── TutorSelector.jsx   # Tutor selection component
│   │   │   │   ├── CoursesList.jsx     # Checkout courses list
│   │   │   │   └── StudentDetailsForm.jsx # Student details form
│   │   │   ├── cart/                   # Shopping cart components
│   │   │   │   ├── CartItem.jsx        # Individual cart item
│   │   │   │   ├── OrderSummary.jsx    # Cart order summary
│   │   │   │   └── CartEmptyState.jsx  # Empty cart state
│   │   │   ├── wishlist/               # Wishlist components
│   │   │   │   ├── WishlistHeader.jsx  # Wishlist page header
│   │   │   │   ├── WishlistCard.jsx    # Individual wishlist item
│   │   │   │   ├── WishlistSearchBar.jsx # Search functionality
│   │   │   │   ├── FilterDropdown.jsx  # Filter options
│   │   │   │   └── WishlistEmptyState.jsx # Empty wishlist state
│   │   │   └── courseDetails/          # Course details components
│   │   │       ├── CourseHero.jsx      # Course hero section
│   │   │       ├── CourseOverview.jsx  # Course overview
│   │   │       ├── CourseCurriculum.jsx # Course curriculum
│   │   │       ├── CourseInstructor.jsx # Instructor info
│   │   │       ├── CourseMotivation.jsx # Motivation section
│   │   │       └── CourseSidebar.jsx   # Course sidebar
│   │   │
│   │   ├── tutor/                      # Tutor components
│   │   │   ├── TutorHeader.jsx         # Fixed header
│   │   │   ├── TutorSidebar.jsx        # Fixed sidebar
│   │   │   ├── TutorFooter.jsx
│   │   │   ├── AnimatedChart.jsx       # Dashboard chart
│   │   │   ├── LessonsList.jsx         # Lesson management component
│   │   │   ├── coupon/                 # Coupon management components
│   │   │   │   ├── CouponStats.jsx     # Coupon statistics cards
│   │   │   │   ├── CouponTable.jsx     # Coupon listing table
│   │   │   │   ├── CouponActions.jsx   # Coupon action buttons
│   │   │   │   ├── CouponEmptyState.jsx # Empty state component
│   │   │   │   └── CreateCouponModal.jsx # Coupon creation modal
│   │   │   └── tutorProfile/           # Tutor profile components
│   │   │       ├── Field.jsx
│   │   │       ├── ReadOnlyField.jsx
│   │   │       ├── TextAreaField.jsx
│   │   │       ├── TagField.jsx
│   │   │       ├── ProfileButtons.jsx
│   │   │       └── SecurityCard.jsx
│   │   │
│   │   ├── admin/                      # Admin components
│   │   │   ├── AdminHeader.jsx         # Fixed header
│   │   │   ├── AdminSidebar.jsx        # Fixed sidebar
│   │   │   ├── AdminFooter.jsx
│   │   │   ├── AdminAnimatedChart.jsx
│   │   │   │
│   │   │   ├── students/               # Student management components
│   │   │   │   ├── StudentTable.jsx
│   │   │   │   ├── StudentRow.jsx
│   │   │   │   └── StudentStatsCards.jsx
│   │   │   │
│   │   │   └── categories/             # Category management components
│   │   │       ├── AddCategoryModal.jsx
│   │   │       ├── EditCategoryModal.jsx
│   │   │       ├── CategoryList.jsx
│   │   │       └── CategoryItem.jsx
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
│   │   ├── UserLayout.jsx              # User pages layout (toggleable sidebar)
│   │   ├── TutorLayout.jsx             # Tutor pages layout (fixed sidebar)
│   │   └── AdminLayout.jsx             # Admin pages layout (fixed sidebar)
│   │
│   ├── pages/                          # Page components
│   │   ├── Home.jsx                    # Landing page (public)
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
│   │   │   ├── UserDashboard.jsx       # User dashboard (protected)
│   │   │   ├── UserProfile.jsx         # User profile management (protected)
│   │   │   ├── Courses.jsx             # Browse courses (protected)
│   │   │   ├── CoursesRefactored.jsx   # Browse courses - Redux version
│   │   │   ├── CourseDetails.jsx       # Course details page (protected)
│   │   │   ├── WishList.jsx            # User wishlist (protected)
│   │   │   ├── Cart.jsx                # Shopping cart (protected)
│   │   │   ├── Checkout.jsx            # Checkout page with multi-coupon support (protected)
│   │   │   └── auth/
│   │   │       ├── UserLogin.jsx       # User login (public)
│   │   │       ├── UserLoginRefactored.jsx # User login - Redux version
│   │   │       └── UserRegister.jsx    # User registration (public)
│   │   │
│   │   ├── tutor/                      # Tutor pages
│   │   │   ├── TutorDashboard.jsx      # Tutor dashboard (protected)
│   │   │   ├── TutorProfile.jsx        # Tutor profile management (protected)
│   │   │   ├── AddCourse.jsx           # Add new course form (protected)
│   │   │   ├── EditCourse.jsx          # Edit course form (protected)
│   │   │   ├── AddLesson.jsx           # Add lessons to course (protected)
│   │   │   ├── ManageCourses.jsx       # Course management dashboard (protected)
│   │   │   ├── Coupon.jsx              # Coupon management page (protected)
│   │   │   └── auth/
│   │   │       ├── TutorLogin.jsx      # Tutor login (public)
│   │   │       └── TutorRegister.jsx   # Tutor registration (public)
│   │   │
│   │   └── admin/                      # Admin pages
│   │       ├── AdminDashboard.jsx      # Admin dashboard (protected)
│   │       ├── AdminProfile.jsx        # Admin profile management (protected)
│   │       ├── ManageUsers.jsx         # User management with pagination (protected)
│   │       ├── ManageTutors.jsx        # Tutor management (protected)
│   │       ├── ManageCategory.jsx      # Category management (protected)
│   │       ├── CategoryView.jsx        # Category details & courses (protected)
│   │       └── auth/
│   │           └── AdminLogin.jsx      # Admin login (public)
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
│   ├── store/                          # Redux Toolkit store
│   │   ├── store.js                    # Store configuration (all reducers)
│   │   └── features/                   # Feature-based slices
│   │       ├── auth/                   # Authentication slices
│   │       │   ├── userAuthSlice.js    # User authentication
│   │       │   ├── tutorAuthSlice.js   # Tutor authentication
│   │       │   ├── adminAuthSlice.js   # Admin authentication
│   │       │   ├── googleAuthSlice.js  # Google OAuth
│   │       │   ├── otpSlice.js         # OTP operations
│   │       │   └── passwordSlice.js    # Password operations
│   │       │
│   │       ├── user/                   # User slices
│   │       │   ├── userProfileSlice.js # User profile & operations
│   │       │   ├── userDashboardSlice.js # User dashboard
│   │       │   ├── userCoursesSlice.js # User course browsing
│   │       │   ├── userWishlistSlice.js # User wishlist
│   │       │   └── userCartSlice.js    # User shopping cart
│   │       │
│   │       ├── tutor/                  # Tutor slices
│   │       │   ├── tutorProfileSlice.js # Tutor profile & operations
│   │       │   ├── tutorDashboardSlice.js # Tutor dashboard
│   │       │   ├── tutorCoursesSlice.js # Tutor course management
│   │       │   ├── tutorCouponSlice.js  # Tutor coupon management
│   │       │   └── tutorCategorySlice.js # Tutor categories
│   │       │
│   │       └── admin/                  # Admin slices
│   │           ├── adminProfileSlice.js # Admin profile
│   │           ├── adminDashboardSlice.js # Admin dashboard
│   │           ├── adminCategorySlice.js # Category management
│   │           ├── adminUserSlice.js   # User management
│   │           └── adminTutorSlice.js  # Tutor management
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
├── eslint.config.js                    # ESLint config
├── README.md                           # Frontend documentation
├── package.json
└── package-lock.json
```

---

## 🔑 Key Features

### Backend
- **Role-based authentication**: User, Tutor, Admin
- **JWT tokens**: Access & Refresh tokens
- **OTP verification**: Email-based OTP
- **File uploads**: Cloudinary & AWS S3 integration
- **Database**: MongoDB with Mongoose ORM
- **Category Management**: CRUD operations for course categories
- **Course Management**: Full course and lesson management
- **User Management**: Admin controls for users and tutors

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **Axios** for API calls with interceptors
- **Sonner** for toast notifications
- **Role-based routing** with route guards
- **Component-based architecture**: Modular and reusable components
- **Modal system**: Blurred backdrop modals with scroll lock
- **Pagination**: Reusable pagination component
- **Stats cards**: Dashboard statistics display

---

## 📝 Route Structure

### Backend API Routes
```
/auth/*               → Shared authentication routes
/user/auth/*          → User authentication (public)
/user/*               → User profile & operations (protected)
/user/courses/*       → User course browsing (protected)
/user/payment/*       → Payment & coupon operations (protected)
/tutor/auth/*         → Tutor authentication (public)
/tutor/*              → Tutor profile (protected)
/tutor/courses/*      → Tutor course management (protected)
/tutor/lessons/*      → Tutor lesson management (protected)
/tutor/coupons/*      → Tutor coupon management (protected)
/admin/auth/*         → Admin authentication (public)
/admin/*              → Admin profile (protected)
/admin/categories/*   → Category management (protected)
/admin/users/*        → User management (protected)
/admin/tutors/*       → Tutor management (protected)
/admin/courses/*      → Course management (protected)
/admin/orders/*       → Order management (protected)
/admin/dashboard/*    → Dashboard stats (protected)
```

### Frontend Routes
```
/                          → Home page
/user/login                → User login
/user/register             → User registration
/user/dashboard            → User dashboard (protected)
/user/profile              → User profile (protected)
/user/courses              → Browse courses (protected)
/user/courses/:id          → Course details (protected)
/user/wishlist             → User wishlist (protected)
/user/cart                 → Shopping cart (protected)
/user/checkout             → Checkout with multi-coupon support (protected)
/tutor/login               → Tutor login
/tutor/register            → Tutor registration
/tutor/dashboard           → Tutor dashboard (protected)
/tutor/profile             → Tutor profile (protected)
/tutor/add-course          → Add new course form (protected)
/tutor/edit-course/:id     → Edit course form (protected)
/tutor/add-lesson          → Add lessons to course (protected)
/tutor/manage-courses      → Manage all courses (protected)
/tutor/coupons             → Coupon management (protected)
/admin/login               → Admin login
/admin/dashboard           → Admin dashboard (protected)
/admin/profile             → Admin profile (protected)
/admin/users               → Manage users (protected)
/admin/tutors              → Manage tutors (protected)
/admin/categories          → Manage categories (protected)
/admin/categories/:id      → View category details (protected)
/forgot-password           → Forgot password (public)
/otp-verify                → OTP verification (public)
/reset-password            → Reset password (public)
/verify-email-change-otp   → Email change OTP (protected)
/verify-password-change-otp → Password change OTP (protected)
/404                       → Not found page
/unauthorized              → Unauthorized access page
```

---

## 🎓 Documentation Files

```
├── README.md                           # Project overview
├── PROJECT_STRUCTURE.md                # This file - project structure
├── REDUX_REFACTOR_COMPLETE_GUIDE.md    # Redux Toolkit migration guide
├── REDUX_QUICK_REFERENCE.md            # Redux patterns quick reference
└── REDUX_REFACTOR_GUIDE.md             # Redux refactoring guide
```

---

## 📦 Recent Additions & Updates

### 1. Redux Toolkit Architecture (MAJOR UPDATE)
**Complete centralized API layer with Redux Toolkit:**

**Redux Slices Created:**

**Authentication Slices:**
- ✅ **userAuthSlice.js** - User authentication operations
  - Login, Register, Logout
  - OTP verification & resend
  - Forgot/Reset password
  - Refresh token & load user
  - Google authentication
  
- ✅ **tutorAuthSlice.js** - Tutor authentication operations
  - Login, Register, Logout
  - OTP verification
  - Profile verification
  
- ✅ **adminAuthSlice.js** - Admin authentication operations
  - Login, Logout
  - Session management
  
- ✅ **googleAuthSlice.js** - Google OAuth integration
- ✅ **otpSlice.js** - OTP operations (send, verify, resend)
- ✅ **passwordSlice.js** - Password operations (change, reset)

**User Slices:**
- ✅ **userProfileSlice.js** - User profile operations
  - Fetch/Update profile
  - Upload profile image
  
- ✅ **userDashboardSlice.js** - User dashboard stats
  
- ✅ **userCoursesSlice.js** - Course browsing
  - Fetch courses with filters
  - Course details
  - Listed categories
  - Filter management
  
- ✅ **userWishlistSlice.js** - Wishlist operations

- ✅ **userCartSlice.js** - Shopping cart operations
  - Add/Remove items
  - Update quantities
  - Cart calculations

**Tutor Slices:**
- ✅ **tutorProfileSlice.js** - Tutor profile & operations
  - Profile management
  - Upload profile image
  
- ✅ **tutorDashboardSlice.js** - Tutor dashboard stats
  
- ✅ **tutorCoursesSlice.js** - Course management
  - Create, Update, Delete courses
  - Upload thumbnails
  - List/Unlist courses
  
- ✅ **tutorCouponSlice.js** - Coupon management
  - Create, Update, Delete coupons
  - Fetch tutor coupons
  - Usage statistics
  
- ✅ **tutorCategorySlice.js** - Category operations

**Admin Slices:**
- ✅ **adminProfileSlice.js** - Admin profile operations
  
- ✅ **adminDashboardSlice.js** - Admin dashboard stats
  
- ✅ **adminCategorySlice.js** - Category CRUD
  - Create, Update, Delete categories
  - List/Unlist categories
  - Pagination support
  
- ✅ **adminUserSlice.js** - User management
  - Block/Unblock users
  - Pagination support
  
- ✅ **adminTutorSlice.js** - Tutor management
  - Approve/Reject tutors
  - Block/Unblock tutors

**Benefits:**
- Centralized API logic
- Consistent error handling
- Clean components (no axios calls)
- Better state management
- Scalable architecture

**Example Components:**
- `CoursesRefactored.jsx` - Complete Redux example
- `UserLoginRefactored.jsx` - Auth with Redux thunks

---

### 2. API Layer Improvements
**Fixed circular dependency issues:**
- Created `setupInterceptors.js` with store reference pattern
- Eliminated circular imports between axios and Redux
- Token attachment works correctly
- 401 error handling with refresh token
- Clean module initialization

**Store Reference Pattern:**
```javascript
// setupInterceptors.js exports setStoreRef()
// main.jsx calls setStoreRef(store) after initialization
// Interceptors access store via reference (no circular dependency)
```

---

### 3. App.jsx Loading State Fix
**Fixed profile page redirect issue:**
- Changed from Redux `selectAuthLoading` to local `isInitializing` state
- Loading screen only shows on initial app mount
- Routes maintain state on page refresh
- No more unwanted redirects to dashboard

**Before:** Redux loading blocked entire app on every auth action
**After:** Local state only blocks during initial authentication check

---

### 4. Backend Models Restructured
The backend models have been reorganized into a modular folder structure:

**Old Structure:**
```
models/
├── userModel.js
├── adminModel.js
├── tutorModel.js
├── categoryModel.js
└── otpModel.js
```

**New Structure:**
```
models/
├── user/          (User, Tutor, Admin, Profile)
├── category/      (Category, SubCategory)
├── common/        (Otp, Notification, Banner)
├── course/        (8 models)
├── review/        (3 models)
└── finance/       (4 models)
```

**Benefits:**
- ✅ Better organization by feature
- ✅ Scalable structure for future models
- ✅ All imports updated across files
- ✅ Direct imports (no index.js needed)

---

### 5. Layout System Implementation
Created unified layout systems for all user roles:

**Features:**
- ✅ **UserLayout.jsx** - Toggleable sidebar with overlay
  - Hamburger menu in header
  - Slide-in/slide-out animation
  - Auto-close on navigation
  - Positioned below header
  
- ✅ **TutorLayout.jsx** - Fixed sidebar layout
  - Persistent sidebar
  - Header, Sidebar, Footer structure
  
- ✅ **AdminLayout.jsx** - Fixed sidebar layout
  - Persistent sidebar
  - Consistent with tutor layout

---

### 6. Category Management System
A complete category management system has been implemented:

#### **Components Created:**
1. **AddCategoryModal.jsx** - Modal for adding new categories
2. **EditCategoryModal.jsx** - Modal for editing existing categories
3. **CategoryList.jsx** - Container component for category listing
4. **CategoryItem.jsx** - Individual category card component

#### **Pages Created:**
1. **ManageCategory.jsx** - Main category management page with:
   - Category statistics (Total, Listed, Unlisted)
   - Search and filter functionality
   - Pagination support
   - List/Unlist category actions
   - Add/Edit/View category actions

2. **CategoryView.jsx** - Category details page showing:
   - Category information with avatar
   - List of courses in the category
   - Course search and filter
   - Responsive course grid layout
   - Back navigation to categories

#### **Features:**
- ✅ **CRUD Operations**: Create, Read, Update, List/Unlist categories
- ✅ **Modal System**: Blurred backdrop modals with scroll lock
- ✅ **Confirmation Toasts**: Warning toasts before unlisting categories
- ✅ **Pagination**: Server-side pagination with 5 items per page
- ✅ **Search & Filter**: Real-time search and status filtering
- ✅ **Stats Display**: Visual statistics cards showing category counts
- ✅ **Responsive Design**: Mobile-first responsive layout
- ✅ **Navigation**: Seamless navigation between category list and details

---

### 7. Course Management System (Tutor)
Created comprehensive course management for tutors:

#### **Pages Created:**

**1. AddCourse.jsx** - Course creation form
**Features:**
- ✅ Form Fields: Title, Category, Price, Discount, Description
- ✅ Image Upload: Drag & drop with preview
- ✅ Validation: All required fields with error messages
- ✅ File Validation: Image type & size (max 5MB) checks
- ✅ Loading States: Button shows "CREATING..." during submission
- ✅ Toast Notifications: Success/error feedback
- ✅ Form Reset: Auto-clears after successful submission
- ✅ Responsive Design: 2-column layout on large screens
- ✅ Styled Inputs: Emerald/cyan color scheme

**2. AddLesson.jsx** - Lesson builder
**Features:**
- ✅ Form Fields: Lesson Title, Description, Duration
- ✅ Multiple Uploads: Video, PDF notes, Thumbnail image
- ✅ Drag & Drop: File upload with drag & drop support
- ✅ Lesson Management: Add, Edit, Remove lessons inline
- ✅ Lesson List: Display all added lessons with thumbnails
- ✅ Edit Functionality: Click "Edit Lesson" to populate form
- ✅ Draft Status: Lessons marked as draft before final submission
- ✅ Validation: Required field checks before adding lessons
- ✅ Responsive Design: 2-column layout with teal/cyan theme
- ✅ No Modals: Everything inline as per design requirements
- ✅ Batch Submit: Submit all lessons at once

**3. ManageCourses.jsx** - Course management dashboard
**Features:**
- ✅ Course Statistics: Total, listed, and unlisted course counts
- ✅ Search Functionality: Real-time search to filter courses
- ✅ Filter Dropdown: Filter courses by status (All/Listed/Unlisted)
- ✅ Responsive Grid: 3-column layout on XL screens
- ✅ Course Cards: Display course image, title, description, price, discount
- ✅ Status Badge: Visual indicator for listed/unlisted status
- ✅ Action Buttons:
  - Edit: Navigate to course edit page
  - List/Unlist: Toggle course visibility
  - Manage Lessons: Navigate to lesson management
  - Exam: Manage course exams
  - Settings: Course settings configuration
- ✅ Modern Design:
  - Gradient backgrounds and buttons
  - Glass-morphism effects with backdrop blur
  - Smooth hover animations with scale and lift effects
  - Image zoom on hover
  - Shadow and border transitions
- ✅ Empty State: Attractive empty state with call-to-action

**4. EditCourse.jsx** - Course editing form
- Edit existing course details
- Update course information
- Manage course status

---
---

## 🚀 Current Architecture Highlights

### **Frontend Architecture:**
1. **Redux Toolkit** - Centralized state management with async thunks
2. **Clean Components** - UI logic only, no API calls
3. **Interceptors** - Automatic token attachment & refresh
4. **Route Guards** - Role-based access control
5. **Layouts** - Consistent UI structure per role
6. **Store Reference Pattern** - Eliminates circular dependencies

### **API Layer:**
- `publicAxios` → Login, Register, OTP (no JWT)
- `userAxios` → User-protected routes
- `tutorAxios` → Tutor-protected routes
- `adminAxios` → Admin-protected routes
- `authAxios` → Refresh token endpoint
- `setupInterceptors` → Token management & 401 handling

### **State Management:**
- Auth state (user, token, role, loading, error)
- User state (profile, dashboard, courses, wishlist)
- Tutor state (profile, dashboard, courses, categories)
- Admin state (profile, dashboard, categories, users, tutors)

### **Key Features:**
- ✅ JWT authentication with refresh tokens
- ✅ Role-based routing (User, Tutor, Admin)
- ✅ Centralized API calls via Redux Toolkit
- ✅ Automatic token refresh on 401
- ✅ File uploads (images, videos, PDFs)
- ✅ Pagination support
- ✅ Search & filter functionality
- ✅ Toggleable sidebar (User layout)
- ✅ Fixed sidebars (Tutor & Admin layouts)
- ✅ Toast notifications (Sonner)
- ✅ Loading states & error handling
- ✅ Form validation
- ✅ Modal system
- ✅ Responsive design
- ✅ No circular dependencies

---

## 📊 Technology Stack

### **Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (Access & Refresh tokens)
- Bcrypt (Password hashing)
- Nodemailer (Email service)
- Cloudinary/AWS S3 (File storage)
- Cookie-based refresh tokens

### **Frontend:**
- React 18 + Vite
- Redux Toolkit (State management)
- React Router v6 (Routing)
- Tailwind CSS (Styling)
- Axios (HTTP client)
- Sonner (Toast notifications)
- Lucide React (Icons)
- React Icons

---

**Last Updated:** January 2025  
**Architecture:** Redux Toolkit + Centralized API Layer + Advanced Coupon System  
**Status:** Production-Ready with Multi-Coupon Support ✅

### 12. Coupon System Implementation (MAJOR UPDATE)
**Complete coupon management system with advanced features:**

#### **Backend Models & Controllers:**
- ✅ **Coupon.js** - Coupon model with validation methods
  - Discount types (percentage/fixed)
  - Usage limits and expiry dates
  - Tutor-specific coupons
  - Minimum purchase requirements
  
- ✅ **CouponUsage.js** - Coupon usage tracking
  - User usage history
  - Order association
  - Discount amount tracking

**Controllers:**
- ✅ **couponController.js** - Tutor coupon management
  - Create, update, delete coupons
  - List tutor coupons
  - Usage statistics
  
- ✅ **paymentController.js** - Enhanced payment processing
  - Multiple coupon validation
  - Tutor-wise coupon application
  - Revenue distribution with discounts

#### **Frontend Components:**

**Tutor Coupon Management:**
- ✅ **Coupon.jsx** - Main coupon management page
  - Coupon statistics and overview
  - Create, edit, delete coupons
  - Usage analytics
  
- ✅ **CreateCouponModal.jsx** - Coupon creation modal
  - Form validation
  - Discount type selection
  - Usage limit configuration
  
- ✅ **CouponTable.jsx** - Coupon listing table
  - Sortable columns
  - Status indicators
  - Action buttons
  
- ✅ **CouponStats.jsx** - Coupon statistics cards
- ✅ **CouponActions.jsx** - Coupon action buttons
- ✅ **CouponEmptyState.jsx** - Empty state component

**User Checkout System:**
- ✅ **PaymentSummary.jsx** - Enhanced checkout summary
  - **Multiple Coupons Per Tutor**: Users can apply multiple eligible coupons from same tutor
  - **Tutor Selection**: Dropdown to choose tutor for coupon browsing
  - **Grouped Display**: Coupons grouped by tutor with individual/bulk removal
  - **Smart Validation**: Prevents duplicate coupon codes across all tutors
  - **Price Breakdown**: Separate display of product and coupon discounts
  
- ✅ **CouponBrowseModal.jsx** - Coupon browsing modal
  - **Enhanced UI**: Shows coupon eligibility and status
  - **Multiple Application**: No restriction on coupons per tutor
  - **Clear Messaging**: Informational display for applied coupons
  - **Duplicate Prevention**: Visual indicators for already applied coupons
  
- ✅ **TutorSelector.jsx** - Tutor selection component
  - **Conditional Display**: Only shows when multiple tutors in cart
  - **Course Count**: Shows number of courses per tutor
  - **Auto-selection**: Automatically selects single tutor

#### **Key Features:**

**1. Tutor-wise Coupon Selection:**
- Students can browse coupons by tutor
- Conditional tutor selection (only for multiple tutors)
- Clear attribution of coupons to tutors

**2. Multiple Coupons Per Tutor:**
- Users can apply multiple eligible coupons from same tutor
- Backward compatible data structure (single coupon → array)
- Individual and bulk coupon removal options
- Grouped display with tutor headers

**3. Duplicate Prevention System:**
- **Frontend Validation**: Real-time checking across all applied coupons
- **Backend Validation**: Server-side duplicate prevention
- **Cross-tutor Prevention**: Same coupon code cannot be used for different tutors
- **Usage Limit Enforcement**: Individual coupon usage limits maintained

**4. Enhanced User Experience:**
- **Visual Grouping**: Multiple coupons from same tutor are visually grouped
- **Clear Attribution**: Each coupon shows tutor name and savings
- **Smart Messaging**: Informational messages instead of blocking actions
- **Flexible Removal**: Remove individual coupons or all from a tutor

**5. Advanced Price Calculation:**
- **Accurate Totals**: All discounts calculated correctly
- **Revenue Distribution**: Tutor revenue properly reduced by their coupons
- **Tax Calculation**: Tax calculated on final discounted amount
- **Order Processing**: Each coupon usage recorded individually

#### **Data Structure:**
```javascript
// Before (Single Coupon Per Tutor)
appliedCoupons = {
  [tutorId]: { code, discountAmount, tutorName, ... }
}

// After (Multiple Coupons Per Tutor)
appliedCoupons = {
  [tutorId]: [
    { code, discountAmount, tutorName, ... },
    { code, discountAmount, tutorName, ... }
  ]
}
```

#### **Business Benefits:**
- **Increased Savings**: Students can maximize discounts by stacking coupons
- **Better UX**: Clear, intuitive interface for managing multiple coupons
- **Flexible Rules**: Tutors can create multiple coupons knowing students can combine them
- **Data Integrity**: Robust validation prevents abuse while enabling legitimate stacking

---

### 13. Course Browsing System (User)
Created course browsing and details pages:

**Pages:**
- **Courses.jsx** - Browse all courses
  - Course grid layout
  - Category filters
  - Search functionality
  - Pagination
  
- **CoursesRefactored.jsx** - Redux version
  - Centralized state management
  - Better performance
  
- **CourseDetails.jsx** - Course details page
  - Course information
  - Lessons list
  - Enrollment options
  - Reviews and ratings
  
- **WishList.jsx** - User wishlist
  - Saved courses
  - Quick enrollment

**Components:**
- **CourseList.jsx** - Course grid component
- **CategoryList.jsx** - Category filter component

---

### 14. Common Components
Reusable components across the application:

**Loading & Error:**
- **LoadingSpinner.jsx** - Loading indicator
  - Customizable size and color
  - Used across all pages

**Navigation:**
- **PublicHeader.jsx** - Public pages header
- **PublicFooter.jsx** - Public pages footer

**Data Display:**
- **Pagination.jsx** - Reusable pagination
  - Server-side pagination support
  - Customizable page size
  
- **StatsCards.jsx** - Statistics display
  - Dashboard statistics
  - Gradient backgrounds

**Tutor Components:**
- **AnimatedChart.jsx** - Tutor dashboard chart
- **LessonsList.jsx** - Lesson management list

**Admin Components:**
- **AdminAnimatedChart.jsx** - Admin dashboard chart

---

### 15. Route Guards System
Comprehensive route protection:

**Generic Guards:**
- **PrivateRoute.jsx** - Basic authentication check

**User Guards:**
- **UserPrivateRoute.jsx** - User-only protected routes
- **UserPublicRoute.jsx** - User public routes (redirect if logged in)

**Tutor Guards:**
- **TutorPrivateRoute.jsx** - Tutor-only protected routes
- **TutorPublicRoute.jsx** - Tutor public routes

**Admin Guards:**
- **AdminPrivateRoute.jsx** - Admin-only protected routes
- **AdminPublicRoute.jsx** - Admin public routes

**Route Configuration:**
- **AppRoutes.jsx** - Main routing configuration
- **UserRoute.jsx** - User routes
- **TutorRoute.jsx** - Tutor routes
- **AdminRoute.jsx** - Admin routes

---
