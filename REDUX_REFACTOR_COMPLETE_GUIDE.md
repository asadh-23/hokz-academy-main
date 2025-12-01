# 🏗️ COMPLETE REDUX TOOLKIT REFACTOR GUIDE

## ✅ COMPLETED WORK

### 1. **Enhanced Auth Slice** (`frontend/src/store/features/auth/authSlice.js`)
- ✅ Created async thunks for all auth operations
- ✅ Login/Register for User, Tutor, Admin
- ✅ OTP verification and resend
- ✅ Forgot/Reset password
- ✅ Refresh token and load user
- ✅ Logout with role-based axios
- ✅ Google authentication
- ✅ Proper loading/error states
- ✅ Selectors exported

### 2. **User Slice** (`frontend/src/store/features/user/userSlice.js`)
- ✅ Fetch/Update user profile
- ✅ Upload profile image
- ✅ Fetch dashboard stats
- ✅ Proper state management

### 3. **Courses Slice** (`frontend/src/store/features/courses/coursesSlice.js`)
- ✅ Fetch courses with filters
- ✅ Fetch course details
- ✅ Fetch listed categories
- ✅ Filter management (search, category, sort, price)
- ✅ Selectors for all state

### 4. **Tutor Slice** (`frontend/src/store/features/tutor/tutorSlice.js`)
- ✅ Fetch/Update tutor profile
- ✅ Upload profile image
- ✅ Fetch dashboard
- ✅ Fetch/Create courses
- ✅ Upload course thumbnail
- ✅ Fetch categories

### 5. **Admin Slice** (`frontend/src/store/features/admin/adminSlice.js`)
- ✅ Fetch admin profile and dashboard
- ✅ Category management (CRUD, list/unlist)
- ✅ User management (fetch, block/unblock)
- ✅ Tutor management
- ✅ Pagination support

### 6. **Store Configuration** (`frontend/src/store/store.js`)
- ✅ All reducers registered
- ✅ Middleware configured
- ✅ DevTools enabled

### 7. **App.jsx Updated**
- ✅ Uses `loadUser` thunk on mount
- ✅ Uses Redux loading state
- ✅ Clean implementation

### 8. **Example Refactored Component**
- ✅ `CoursesRefactored.jsx` - Complete example

---

## 📋 REFACTOR CHECKLIST

### Phase 1: Auth Pages ✅ (COMPLETED IN SLICES)
- [ ] `UserLogin.jsx` - Use `loginUser` thunk
- [ ] `UserRegister.jsx` - Use `registerUser` thunk
- [ ] `TutorLogin.jsx` - Use `loginTutor` thunk
- [ ] `TutorRegister.jsx` - Use `registerTutor` thunk
- [ ] `AdminLogin.jsx` - Use `loginAdmin` thunk
- [ ] `OtpVerify.jsx` - Use `verifyOtp` thunk
- [ ] `ForgotPassword.jsx` - Use `forgotPassword` thunk
- [ ] `ResetPassword.jsx` - Use `resetPassword` thunk

### Phase 2: User Pages
- [ ] `UserProfile.jsx` - Use user slice thunks
- [ ] `UserDashboard.jsx` - Use `fetchUserDashboard`
- [✅] `Courses.jsx` - EXAMPLE PROVIDED (CoursesRefactored.jsx)
- [ ] `CourseDetails.jsx` - Use `fetchCourseDetails`
- [ ] `WishList.jsx` - Create wishlist slice

### Phase 3: Tutor Pages
- [ ] `TutorProfile.jsx` - Use tutor slice thunks
- [ ] `TutorDashboard.jsx` - Use `fetchTutorDashboard`
- [ ] `AddCourse.jsx` - Use `createCourse` and `uploadCourseThumbnail`
- [ ] `ManageCourses.jsx` - Use `fetchTutorCourses`
- [ ] `AddLesson.jsx` - Create lesson slice
- [ ] `EditCourse.jsx` - Create update course thunk

### Phase 4: Admin Pages
- [ ] `AdminProfile.jsx` - Use admin slice thunks
- [ ] `AdminDashboard.jsx` - Use `fetchAdminDashboard`
- [ ] `ManageCategory.jsx` - Use admin category thunks
- [ ] `CategoryView.jsx` - Use admin thunks
- [ ] `ManageUsers.jsx` - Use `fetchUsers` and `toggleUserBlock`
- [ ] `ManageTutors.jsx` - Use `fetchTutors`

### Phase 5: Components
- [ ] `ChangeEmailModal.jsx` - Create change email thunk
- [ ] `ChangePasswordModal.jsx` - Create change password thunk
- [ ] `GoogleAuth.jsx` - Use `googleAuth` thunk
- [ ] `TutorSidebar.jsx` - Use `logout` thunk
- [ ] `AdminSidebar.jsx` - Use `logout` thunk

---

## 🎯 HOW TO REFACTOR A COMPONENT

### BEFORE (Component-level axios):
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await userAxios.get("/endpoint");
            setData(response.data.items);
        } catch (error) {
            setError(error.message);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);
```

### AFTER (Redux Toolkit):
```javascript
import { useDispatch, useSelector } from "react-redux";
import { fetchData, selectData, selectLoading, selectError } from "../../store/features/slice";

const data = useSelector(selectData);
const loading = useSelector(selectLoading);
const error = useSelector(selectError);
const dispatch = useDispatch();

useEffect(() => {
    dispatch(fetchData());
}, [dispatch]);

useEffect(() => {
    if (error) {
        toast.error(error);
    }
}, [error]);
```

---

## 🔧 CREATING NEW THUNKS

### Template:
```javascript
export const yourThunkName = createAsyncThunk(
    "sliceName/actionName",
    async (params, { rejectWithValue }) => {
        try {
            const response = await correctAxiosInstance.method("/endpoint", params);
            return response.data; // ONLY return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Error message" });
        }
    }
);
```

### Add to extraReducers:
```javascript
builder
    .addCase(yourThunkName.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(yourThunkName.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
    })
    .addCase(yourThunkName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Operation failed";
    });
```

---

## 🚀 NEXT STEPS

1. **Start with Auth Pages** - Easiest to refactor
2. **Move to User Pages** - Use the `CoursesRefactored.jsx` as template
3. **Refactor Tutor Pages** - Similar pattern
4. **Refactor Admin Pages** - Use admin slice
5. **Update Components** - Modals and sidebars
6. **Test Everything** - Ensure all API calls work
7. **Remove Old Code** - Clean up component-level axios calls

---

## 📝 IMPORTANT NOTES

### Axios Instance Rules:
- `publicAxios` → Login, Register, OTP, Forgot Password
- `userAxios` → User-protected routes
- `tutorAxios` → Tutor-protected routes
- `adminAxios` → Admin-protected routes
- `authAxios` → Refresh token only

### Error Handling:
- Always use `rejectWithValue` in thunks
- Display errors using `useEffect` with toast
- Clear errors when needed using `clearError` actions

### Loading States:
- Use Redux loading state, not component state
- Show loaders based on `selectLoading` selector

### Data Flow:
1. Component dispatches thunk
2. Thunk calls API
3. Redux updates state
4. Component re-renders with new data

---

## 🎓 EXAMPLE: Refactoring UserLogin.jsx

### BEFORE:
```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const response = await publicAxios.post("/user/auth/login", { email, password });
        dispatch(loginSuccess(response.data));
        navigate("/user/dashboard");
    } catch (error) {
        toast.error(error.response?.data?.message);
    } finally {
        setIsLoading(false);
    }
};
```

### AFTER:
```javascript
import { loginUser, selectAuthLoading, selectAuthError } from "../../store/features/auth/authSlice";

const loading = useSelector(selectAuthLoading);
const error = useSelector(selectAuthError);
const dispatch = useDispatch();

const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
        navigate("/user/dashboard");
        toast.success("Login successful");
    }
};

useEffect(() => {
    if (error) {
        toast.error(error);
    }
}, [error]);
```

---

## ✨ BENEFITS OF THIS ARCHITECTURE

1. **Centralized API Logic** - All API calls in one place
2. **Consistent Error Handling** - Standardized across app
3. **Better Testing** - Easy to mock Redux state
4. **Type Safety** - Can add TypeScript easily
5. **Caching** - Redux persists data
6. **Optimistic Updates** - Easy to implement
7. **Clean Components** - UI logic only
8. **Scalable** - Easy to add new features

---

## 🔄 MIGRATION STRATEGY

### Week 1: Foundation
- ✅ Create all slices (DONE)
- ✅ Update store (DONE)
- ✅ Update App.jsx (DONE)

### Week 2: Auth & User
- Refactor all auth pages
- Refactor user profile and dashboard
- Refactor courses page

### Week 3: Tutor & Admin
- Refactor tutor pages
- Refactor admin pages
- Update all modals

### Week 4: Testing & Cleanup
- Test all features
- Remove old code
- Update documentation

---

## 📞 SUPPORT

If you encounter issues:
1. Check the slice for the correct thunk name
2. Verify axios instance is correct
3. Check selector names
4. Ensure dispatch is called correctly
5. Look at `CoursesRefactored.jsx` for reference

---

**Status**: Foundation Complete ✅
**Next**: Start refactoring auth pages
**Priority**: High - This will improve code quality significantly
