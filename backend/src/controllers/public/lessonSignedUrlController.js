import Lesson from "../../models/course/Lesson.js";

export const getLessonSecureUrl = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        // Cloudinary URLs are public and optimized, no need for signed URLs
        if (!lesson.videoUrl) {
            return res.status(404).json({ message: "Video not found for this lesson" });
        }

        res.status(200).json({ signedUrl: lesson.videoUrl });
    } catch (error) {
        console.error("Secure URL Controller Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};