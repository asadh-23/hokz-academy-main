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
│   │       ├── profileController.js    # Admin management
│   │       ├── categoryController.js   # Category management
│   │       └── userManagementController.js # User management
│   │
│   ├── middlewares/                    # Express middleware
│   │   ├── authMiddleware.js           # JWT authentication
│   │   ├── errorHandler.js             # Error handling
│   │   └── uploadMiddleware.js         # File upload handling
│   │
│   ├── models/                         # Database models (MongoDB/Mongoose)
│   │   ├── user/                       # User-related models
│   │   │   ├── User.js                 # User model
│   │   │   ├── Tutor.js                # Tutor model
│   │   │   ├── Admin.js                # Admin model
│   │   │   └── Profile.js              # Profile model (placeholder)
│   │   ├── category/                   # Category models
│   │   │   ├── Category.js             # Category model
│   │   │   └── SubCategory.js          # SubCategory (placeholder)
│   │   ├── common/                     # Common models
│   │   │   ├── Otp.js                  # OTP model
│   │   │   ├── Notification.js         # Notification (placeholder)
│   │   │   └── Banner.js               # Banner (placeholder)
│   │   ├── course/                     # Course models (placeholders)
│   │   │   ├── Course.js
│   │   │   ├── Lesson.js
│   │   │   ├── Section.js
│   │   │   ├── Quiz.js
│   │   │   ├── QuizQuestion.js
│   │   │   ├── Enrollment.js
│   │   │   ├── Progress.js
│   │   │   └── Certificate.js
│   │   ├── review/                     # Review models (placeholders)
│   │   │   ├── Review.js
│   │   │   ├── Report.js
│   │   │   └── TutorResponse.js
│   │   └── finance/                    # Finance models (placeholders)
│   │       ├── Order.js
│   │       ├── Transaction.js
│   │       ├── Payout.js
│   │       └── Revenue.js
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
│       ├── generateToken.js            # JWT token utilities
│       └── validation.js               # Input validation
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
│   │   │   ├── Pagination.jsx
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
│   │   │       ├── CategoryItem.jsx
│   │   │       └── CategoryStatsCards.jsx
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
│   │   ├── TutorLayout.jsx             # Tutor pages layout (NEW)
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
│   │   │   ├── AddCourse.jsx           # Add new course form
│   │   │   ├── AddLesson.jsx           # Add lessons to course (NEW)
│   │   │   ├── ManageCourses.jsx
│   │   │   └── auth/
│   │   │       ├── TutorLogin.jsx
│   │   │       └── TutorRegister.jsx
│   │   │
│   │   └── admin/                      # Admin pages
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProfile.jsx
│   │       ├── ManageUsers.jsx         # User management with pagination
│   │       ├── ManageTutors.jsx
│   │       ├── ManageCategory.jsx      # Category management (NEW)
│   │       ├── CategoryView.jsx        # Category details & courses (NEW)
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
- **Category Management**: CRUD operations for course categories

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
/user/auth/*          → User authentication (public)
/user/*               → User profile (protected)
/tutor/auth/*         → Tutor authentication (public)
/tutor/*              → Tutor profile (protected)
/admin/auth/*         → Admin authentication (public)
/admin/*              → Admin management (protected)
```

### Frontend Routes
```
/                          → Home page
/user/login                → User login
/user/register             → User registration
/user/dashboard            → User dashboard (protected)
/tutor/login               → Tutor login
/tutor/register            → Tutor registration
/tutor/dashboard           → Tutor dashboard (protected)
/admin/login               → Admin login
/admin/dashboard           → Admin dashboard (protected)
/admin/users               → Manage users (protected)
/admin/tutors              → Manage tutors (protected)
/admin/categories          → Manage categories (protected)
/admin/categories/:id      → View category details (protected)
/tutor/add-course          → Add new course form (protected)
/tutor/add-lesson          → Add lessons to course (protected)
/tutor/manage-courses      → Manage all courses (protected)
```

---

## 📦 Recent Additions & Updates

### 1. Backend Models Restructured
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
├── course/        (8 models - placeholders)
├── review/        (3 models - placeholders)
└── finance/       (4 models - placeholders)
```

**Benefits:**
- ✅ Better organization by feature
- ✅ Scalable structure for future models
- ✅ All imports updated across 11 files
- ✅ Direct imports (no index.js needed)

---

### 2. TutorLayout Implementation
Created a unified layout system for tutor pages:

**Features:**
- ✅ TutorLayout.jsx with Header, Sidebar, Footer
- ✅ Removed duplicate layout code from TutorDashboard & TutorProfile
- ✅ Matches AdminLayout pattern
- ✅ Cleaner, more maintainable code

---

### 3. Category Management System
A complete category management system has been implemented with the following features:

#### **Components Created:**
1. **AddCategoryModal.jsx** - Modal for adding new categories
2. **EditCategoryModal.jsx** - Modal for editing existing categories
3. **CategoryList.jsx** - Container component for category listing
4. **CategoryItem.jsx** - Individual category card component
5. **CategoryStatsCards.jsx** - Statistics cards for categories

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

### 4. Add Course Page (Tutor)
Created a comprehensive course creation form for tutors:

**Page:** `frontend/src/pages/tutor/AddCourse.jsx`

**Features:**
- ✅ **Form Fields**: Title, Category, Price, Discount, Description
- ✅ **Image Upload**: Drag & drop with preview
- ✅ **Validation**: All required fields with proper error messages
- ✅ **File Validation**: Image type & size (max 5MB) checks
- ✅ **Loading States**: Button shows "CREATING..." during submission
- ✅ **Toast Notifications**: Success/error feedback
- ✅ **Form Reset**: Auto-clears after successful submission
- ✅ **Responsive Design**: 2-column layout on large screens
- ✅ **Styled Inputs**: Emerald/cyan color scheme matching design

**Route:** `/tutor/add-course` (Protected with TutorLayout)

---

### 5. Add Lesson Page (Tutor)
Created a comprehensive lesson builder for adding lessons to courses:

**Page:** `frontend/src/pages/tutor/AddLesson.jsx`

**Features:**
- ✅ **Form Fields**: Lesson Title, Description (textarea), Duration
- ✅ **Multiple Uploads**: Video, PDF notes, Thumbnail image
- ✅ **Drag & Drop**: File upload with drag & drop support
- ✅ **Lesson Management**: Add, Edit, Remove lessons inline
- ✅ **Lesson List**: Display all added lessons with thumbnails
- ✅ **Edit Functionality**: Click "Edit Lesson" to populate form
- ✅ **Draft Status**: Lessons marked as draft before final submission
- ✅ **Validation**: Required field checks before adding lessons
- ✅ **Responsive Design**: 2-column layout with teal/cyan theme
- ✅ **No Modals**: Everything inline as per design requirements
- ✅ **Batch Submit**: Submit all lessons at once with final "Submit" button

**Route:** `/tutor/add-lesson` (Protected with TutorLayout)

---

### 6. Manage Courses Page (Tutor)
Created a modern course management dashboard for tutors:

**Page:** `frontend/src/pages/tutor/ManageCourses.jsx`

**Features:**
- ✅ **Course Statistics**: Display total, listed, and unlisted course counts with gradient badges
- ✅ **Search Functionality**: Real-time search to filter courses by title
- ✅ **Filter Dropdown**: Filter courses by status (All/Listed/Unlisted)
- ✅ **Responsive Grid**: 3-column layout on XL screens with wider cards
- ✅ **Course Cards**: Display course image, title, description, price, discount, enrollment
- ✅ **Status Badge**: Visual indicator for listed/unlisted status
- ✅ **Action Buttons**: 
  - Edit: Navigate to course edit page
  - List/Unlist: Toggle course visibility
  - Manage Lessons: Navigate to lesson management
  - Exam: Manage course exams
  - Settings: Course settings configuration
- ✅ **Modern Design**: 
  - Gradient backgrounds and buttons
  - Glass-morphism effects with backdrop blur
  - Smooth hover animations with scale and lift effects
  - Image zoom on hover
  - Shadow and border transitions
- ✅ **Empty State**: Attractive empty state with call-to-action
- ✅ **Navigation**: Seamless navigation to AddCourse, AddLesson, and other pages

**Design Highlights:**
- Gradient background (slate to indigo)
- Premium card design with rounded-2xl corners
- Gradient text for headings
- Enhanced shadows and hover effects
- Responsive layout with proper spacing
- Modern color scheme with teal/cyan accents

**Route:** `/tutor/manage-courses` (Protected with TutorLayout)
