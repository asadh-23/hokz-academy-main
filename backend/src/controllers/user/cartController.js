import Cart from "../../models/cart/Cart.js";
import Course from "../../models/course/Course.js";
import mongoose from "mongoose";

export const addToUserCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const course = await Course.findById(courseId).select("isListed isDeleted");
        if (!course || !course.isListed || course.isDeleted) {
            return res.status(404).json({ message: "Course is currently unavailable" });
        }

        const cart = await Cart.findOneAndUpdate(
            {
                user: userId,
                "items.course": { $ne: courseId },
            },
            {
                $push: {
                    items: {
                        course: courseId,
                        addedAt: new Date(),
                    },
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        ).populate({
            path: "items.course",
            select: "title price offerPercentage thumbnailUrl isListed isDeleted tutor category lessonsCount reviews",
            populate: {
                path: "tutor",
                select: "fullName profileImage",
            },
        });

        let subTotal = 0;

        const cartObj = cart.toObject();

        const formattedItems = cartObj.items.map((item) => {
            const course = item.course;
            const price = course.price || 0;
            const discount = course.offerPercentage || 0;

            const currentPrice = Math.round(price - (price * discount) / 100);

            subTotal += currentPrice;

            return {
                ...item,
                course: {
                    ...course,
                    currentPrice: currentPrice,
                },
            };
        });

        const taxAmount = Math.round(subTotal * 0.05);
        const totalAmount = subTotal + taxAmount;

        return res.status(200).json({
            message: "Course added to cart",
            cart: {
                _id: cart._id,
                user: cart.user,
                items: formattedItems,
                subTotal: Math.round(subTotal),
                tax: taxAmount,
                totalAmount: Math.round(totalAmount),
                // appliedCoupon: cart.appliedCoupon || null,
            },
        });
    } catch (err) {
        console.error("Error adding to cart:", err);

        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }

        if (err.code === 11000) {
            return res.status(409).json({ message: "Course already in cart" });
        }

        return res.status(500).json({ message: "Server error" });
    }
};

export const getUserCart = async (req, res) => {
    try {
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId }).populate({
            path: "items.course",
            select: "title price offerPercentage thumbnailUrl isListed isDeleted tutor category lessonsCount reviews",
            populate: {
                path: "tutor",
                select: "fullName profileImage",
            },
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: {
                    _id: null,
                    items: [],
                    totalAmount: 0,
                    subTotal: 0,
                    tax: 0,
                },
            });
        }

        // 2. Filter Valid Items (Logic remains same)
        const originalItemCount = cart.items.length;
        const validItems = cart.items.filter((item) => {
            return item.course && item.course.isListed && !item.course.isDeleted;
        });

        if (validItems.length < originalItemCount) {
            cart.items = validItems;
            await cart.save(); // Save changes to DB
        }

        
        const cartObj = cart.toObject();

      

        let subTotal = 0;

        const formattedItems = cartObj.items.map((item) => {
            const course = item.course;

       
            if (!course) return item;

            const price = course.price || 0;
            const discount = course.offerPercentage || 0;

            const currentPrice = Math.round(price - (price * discount) / 100);

            subTotal += currentPrice;

            return {
                ...item,
                course: {
                    ...course, // No need for .toObject() here anymore
                    currentPrice: currentPrice, // Inject new field
                },
            };
        });

        // 4. Calculate Totals
        // let appliedCoupon = cart.appliedCoupon || null;
        const taxAmount = Math.round(subTotal * 0.05);
        const totalAmount = subTotal + taxAmount;

        return res.status(200).json({
            success: true,
            cart: {
                _id: cart._id,
                user: cart.user,
                items: formattedItems,
                subTotal: Math.round(subTotal),
                tax: taxAmount,
                totalAmount: Math.round(totalAmount),
                // appliedCoupon: appliedCoupon,
            },
        });
    } catch (err) {
        console.error("Get Cart Error:", err);
        return res.status(500).json({ message: "Failed to fetch cart details" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { itemId } = req.params;

      
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { 
                $pull: { items: { _id: itemId } } 
            },
            { new: true }
        ).populate({
            path: "items.course",
            select: "title price offerPercentage thumbnailUrl isListed isDeleted tutor category lessonsCount reviews",
            populate: {
                path: "tutor",
                select: "name profileImage",
            },
        });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        const cartObj = cart.toObject();
        let subTotal = 0;

        const formattedItems = cartObj.items.map((item) => {
            const course = item.course;
            
            // Handle edge case where course might be null (if deleted from DB)
            if(!course) return item;

            const price = course.price || 0;
            const discount = course.offerPercentage || 0;

            const currentPrice = Math.round(price - (price * discount) / 100);
            
            subTotal += currentPrice;

            return {
                ...item,
                course: {
                    ...course,
                    currentPrice: currentPrice,
                },
            };
        });

        // 3. Final Math
        const taxAmount = Math.round(subTotal * 0.05);
        const totalAmount = subTotal + taxAmount;

        return res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart: {
                _id: cart._id,
                user: cart.user,
                items: formattedItems,
                subTotal: Math.round(subTotal),
                tax: taxAmount,
                totalAmount: Math.round(totalAmount),
                appliedCoupon: cart.appliedCoupon || null
            },
        });

    } catch (err) {
        console.error("Remove Cart Error:", err);
        return res.status(500).json({ message: "Failed to remove item" });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart: {
                _id: cart._id,
                user: cart.user,
                items: [],
                subTotal: 0,
                tax: 0,
                totalAmount: 0,
                // appliedCoupon: null
            },
        });

    } catch (err) {
        console.error("Clear Cart Error:", err);
        return res.status(500).json({ message: "Failed to clear cart" });
    }
};