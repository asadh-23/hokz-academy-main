# 🚀 Redux Toolkit Quick Reference

## 📦 Import Pattern

```javascript
import { useDispatch, useSelector } from "react-redux";
import {
    thunkName,
    selectData,
    selectLoading,
    selectError,
    clearError,
} from "../../store/features/sliceName/sliceFile";
```

## 🎣 Hook Setup

```javascript
const dispatch = useDispatch();
const data = useSelector(selectData);
const loading = useSelector(selectLoading);
const error = useSelector(selectError);
```

## 🔄 Dispatch Patterns

### Simple Dispatch (Fire and Forget)
```javascript
useEffect(() => {
    dispatch(fetchData());
}, [dispatch]);
```

### Dispatch with Success Handling
```javascript
const handleSubmit = async () => {
    const result = await dispatch(createItem(formData));
    
    if (createItem.fulfilled.match(result)) {
        toast.success("Success!");
        navigate("/success-page");
    }
};
```

### Dispatch with Error Handling
```javascript
const handleAction = async () => {
    try {
        const result = await dispatch(someAction(params));
        
        if (someAction.fulfilled.match(result)) {
            // Success
            toast.success("Action completed");
        } else if (someAction.rejected.match(result)) {
            // Error (also handled by useEffect below)
            console.error("Action failed");
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
};
```

## 🎯 Error Display Pattern

```javascript
useEffect(() => {
    if (error) {
        toast.error(error);
    }
}, [error]);

// Clear error on unmount
useEffect(() => {
    return () => {
        dispatch(clearError());
    };
}, [dispatch]);
```

## 🔄 Filter/Search Pattern

```javascript
// Debounced search
const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
    const timer = setTimeout(() => {
        dispatch(setFilters({ search: searchTerm }));
    }, 300);

    return () => clearTimeout(timer);
}, [searchTerm, dispatch]);

// Immediate filter
const handleCategoryChange = (categoryId) => {
    dispatch(setFilters({ category: categoryId }));
};
```

## 📄 Pagination Pattern

```javascript
const currentPage = useSelector(selectCurrentPage);
const totalPages = useSelector(selectTotalPages);

const handlePageChange = (page) => {
    dispatch(fetchData({ page, limit: 10 }));
};
```

## 🖼️ File Upload Pattern

```javascript
const uploadingImage = useSelector(selectUploadingImage);

const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const result = await dispatch(uploadImage(formData));
    
    if (uploadImage.fulfilled.match(result)) {
        toast.success("Image uploaded successfully");
    }
};
```

## 🔐 Auth Pattern

```javascript
// Login
const handleLogin = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    
    if (loginUser.fulfilled.match(result)) {
        navigate("/dashboard");
        toast.success("Welcome back!");
    }
};

// Logout
const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
    toast.success("Logged out successfully");
};
```

## 📝 Form Submission Pattern

```javascript
const [formData, setFormData] = useState({ name: "", email: "" });
const loading = useSelector(selectLoading);

const handleChange = (e) => {
    setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
        toast.error("Please fill all fields");
        return;
    }
    
    const result = await dispatch(submitForm(formData));
    
    if (submitForm.fulfilled.match(result)) {
        setFormData({ name: "", email: "" }); // Reset form
        toast.success("Form submitted!");
    }
};
```

## 🎨 Loading State UI

```javascript
if (loading) {
    return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
    );
}
```

## 📊 Conditional Rendering

```javascript
{loading ? (
    <LoadingSpinner />
) : error ? (
    <ErrorMessage message={error} />
) : data.length > 0 ? (
    <DataList items={data} />
) : (
    <EmptyState />
)}
```

## 🔄 Optimistic Update Pattern

```javascript
const handleToggle = async (itemId) => {
    // Optimistic update
    dispatch(updateItemLocally({ id: itemId, status: "active" }));
    
    const result = await dispatch(toggleItem(itemId));
    
    if (toggleItem.rejected.match(result)) {
        // Revert on error
        dispatch(revertItemUpdate(itemId));
        toast.error("Update failed");
    }
};
```

## 🎯 Multiple Dispatches

```javascript
useEffect(() => {
    // Fetch multiple resources
    dispatch(fetchUsers());
    dispatch(fetchCategories());
    dispatch(fetchStats());
}, [dispatch]);
```

## 🔍 Derived State with Selectors

```javascript
// In slice file
export const selectFilteredItems = createSelector(
    [selectItems, selectFilters],
    (items, filters) => {
        return items.filter(item => 
            item.name.includes(filters.search) &&
            (filters.category ? item.category === filters.category : true)
        );
    }
);

// In component
const filteredItems = useSelector(selectFilteredItems);
```

## 🎭 Modal Pattern

```javascript
const [isModalOpen, setIsModalOpen] = useState(false);
const loading = useSelector(selectLoading);

const handleModalSubmit = async (data) => {
    const result = await dispatch(createItem(data));
    
    if (createItem.fulfilled.match(result)) {
        setIsModalOpen(false);
        toast.success("Item created!");
    }
};
```

## 🔄 Refresh Pattern

```javascript
const handleRefresh = () => {
    dispatch(clearFilters());
    dispatch(fetchData());
    toast.success("Data refreshed");
};
```

## 📱 Responsive Data Fetching

```javascript
useEffect(() => {
    const handleResize = () => {
        const isMobile = window.innerWidth < 768;
        dispatch(fetchData({ limit: isMobile ? 5 : 10 }));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
}, [dispatch]);
```

## 🎪 Polling Pattern

```javascript
useEffect(() => {
    // Initial fetch
    dispatch(fetchData());
    
    // Poll every 30 seconds
    const interval = setInterval(() => {
        dispatch(fetchData());
    }, 30000);
    
    return () => clearInterval(interval);
}, [dispatch]);
```

## 🔐 Protected Action Pattern

```javascript
const isAuthenticated = useSelector(selectIsAuthenticated);
const role = useSelector(selectUserRole);

const handleProtectedAction = async () => {
    if (!isAuthenticated) {
        toast.error("Please login first");
        navigate("/login");
        return;
    }
    
    if (role !== "admin") {
        toast.error("Unauthorized");
        return;
    }
    
    await dispatch(protectedAction());
};
```

## 🎯 Batch Actions

```javascript
const handleBatchUpdate = async (items) => {
    const promises = items.map(item => 
        dispatch(updateItem(item))
    );
    
    const results = await Promise.all(promises);
    
    const successCount = results.filter(r => 
        updateItem.fulfilled.match(r)
    ).length;
    
    toast.success(`${successCount} items updated`);
};
```

---

## 🎓 Common Mistakes to Avoid

❌ **DON'T**: Use component state for API data
```javascript
const [data, setData] = useState([]);
```

✅ **DO**: Use Redux state
```javascript
const data = useSelector(selectData);
```

---

❌ **DON'T**: Handle loading in component
```javascript
const [loading, setLoading] = useState(false);
```

✅ **DO**: Use Redux loading state
```javascript
const loading = useSelector(selectLoading);
```

---

❌ **DON'T**: Try/catch in component
```javascript
try {
    await axios.get("/api/data");
} catch (error) {
    // handle error
}
```

✅ **DO**: Let Redux handle errors
```javascript
await dispatch(fetchData());
// Error handled by thunk and displayed via useEffect
```

---

❌ **DON'T**: Forget to clear errors
```javascript
// Error persists across pages
```

✅ **DO**: Clear on unmount
```javascript
useEffect(() => {
    return () => dispatch(clearError());
}, [dispatch]);
```

---

## 📚 Resources

- Redux Toolkit Docs: https://redux-toolkit.js.org/
- createAsyncThunk: https://redux-toolkit.js.org/api/createAsyncThunk
- createSelector: https://redux-toolkit.js.org/api/createSelector
- Best Practices: https://redux.js.org/style-guide/style-guide

---

**Remember**: Keep components clean, let Redux handle the data!
