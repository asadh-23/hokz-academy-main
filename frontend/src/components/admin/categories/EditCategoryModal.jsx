import { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminAxios } from "../../../api/adminAxios";
import { isNullOrWhitespace } from "../../../utils/validation";

const EditCategoryModal = ({ isOpen, onClose, onSuccess, category }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    // Update form data when category changes
    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || "",
                description: category.description || "",
            });
        }
    }, [category]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = "hidden";

            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isNullOrWhitespace(formData.name)) {
            return toast.error("Category name is required");
        }

        if (isNullOrWhitespace(formData.description)) {
            return toast.error("Description is required");
        }

        const trimmedName = formData.name.trim();
        const trimmedDescription = formData.description.trim();

        try {
            const response = await adminAxios.put(`/categories/${category._id}`, {
                name: trimmedName,
                description: trimmedDescription,
            });

            if (response.data?.success) {
                toast.success(response.data?.message || "Category updated successfully");
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error("Failed to update category:", error);
            toast.error(error.response?.data?.message || "Failed to update category");
        }
    };

    const handleClose = () => {
        setFormData({ name: "", description: "" });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm bg-gradient-to-br from-white/30 to-gray-100/30 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-6 w-full max-w-md transform transition-all animate-in fade-in-0 zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Enter category name"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Enter category description"
                            rows="3"
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Update Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryModal;
