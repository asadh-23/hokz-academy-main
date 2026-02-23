import Lesson from "../../models/course/Lesson.js";
import { getSecureURL } from "../../services/s3UploadService.js";

export const getLessonSecureUrl = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        // S3 service-il nammal undakkiya function vilikkuka
        const signedUrl = await getSecureURL(lesson.videoKey || lesson.videoUrl.split('.amazonaws.com/')[1]);

        if (!signedUrl) {
            return res.status(500).json({ message: "Error generating secure link" });
        }

        res.status(200).json({ signedUrl });
    } catch (error) {
        console.error("Secure URL Controller Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};