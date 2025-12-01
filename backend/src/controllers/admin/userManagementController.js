import User from "../../models/user/User.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const searchTerm = req.query.search || "";
        const statusFilter = req.query.status || "";

        const query = { role: "user" };

        // 🔍 Search filter
        if (searchTerm) {
            const searchRegex = new RegExp(searchTerm, "i");
            query.$or = [{ fullName: searchRegex }, { email: searchRegex }];
        }

        if (statusFilter) {
            if (statusFilter === "Blocked") query.isBlocked = true;
            else if (statusFilter === "Active") {
                query.isBlocked = false;
                query.isVerified = true;
            } else if (statusFilter === "Inactive") query.isVerified = false;
        }

        const totalFilteredUsers = await User.countDocuments(query);

        const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

        // 🧩 Format users with computed status
        const formattedUsers = users.map((user) => {
            let computedStatus;
            if (user.isBlocked) {
                computedStatus = "Blocked";
            } else if (!user.isVerified) {
                computedStatus = "Inactive"; // or "Pending Verification"
            } else {
                computedStatus = "Active";
            }

            return {
                ...user,
                status: computedStatus,
            };
        });

        // 📊 Global stats (not affected by filters)
        const [total, active, blocked, inactive] = await Promise.all([
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "user", isBlocked: false, isVerified: true }),
            User.countDocuments({ role: "user", isBlocked: true }),
            User.countDocuments({ role: "user", isVerified: false }),
        ]);

        const totalPages = Math.ceil(totalFilteredUsers / limit);

        // ✅ Final Response
        res.status(200).json({
            success: true,
            users: formattedUsers,
            pagination: {
                currentPage: page,
                totalPages,
                totalFilteredUsers,
            },
            stats: {
                total,
                active,
                blocked,
                inactive,
            },
        });
    } catch (error) {
        console.error("Error in getAllUsers controller:", error);
        next(error);
    }
};

export const toggleBlockUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Toggle logic
        user.isBlocked = !user.isBlocked;
        await user.save();

        // Response message
        const statusMessage = user.isBlocked ? "blocked" : "unblocked";

        return res.status(200).json({
            success: true,
            message: `${user.fullName} has been ${statusMessage} successfully`,
        });
    } catch (error) {
        console.error("Error in toggle block controller:", error);
        next(error);
    }
};
