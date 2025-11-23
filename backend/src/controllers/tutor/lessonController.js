import Course from "../../models/course/Course.js";
import mongoose from "mongoose";
import Lesson from "../../models/course/Lesson.js";
import { uploadToS3, deleteFromS3 } from "../../services/s3UploadService.js";
import { getVideoDuration } from "../../utils/videoUtils.js";

export const uploadLessonFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file received",
            });
        }

        const { type } = req.body;

        // Validate file type
        const allowed = ["video", "thumbnail", "pdfNotes"];
        if (!allowed.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid upload file type",
            });
        }

        let folder = "";
        if (type === "video") folder = "lesson-videos";
        if (type === "thumbnail") folder = "lesson-thumbnails";
        if (type === "pdfNotes") folder = "lesson-pdfs";

        // Upload to S3
        const { key, url } = await uploadToS3(req.file, folder);

        return res.status(200).json({
            success: true,
            message: `${type} uploaded successfully`,
            fileUrl: url,
            fileKey: key,
        });
    } catch (error) {
        console.error("Lesson file upload error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload file",
        });
    }
};

export const createLesson = async (req, res) => {
    try {
        const { courseId } = req.params;

        const { title, description, videoUrl, videoKey, duration, thumbnailUrl, thumbnailKey, pdfUrl, pdfKey } = req.body;

        if (!title || !description || !videoUrl || !thumbnailUrl) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const course = await Course.findOne({
            _id: courseId,
            tutor: req.user._id,
        });

        if (!course) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const existingCount = await Lesson.countDocuments({ course: courseId });

        const lesson = await Lesson.create({
            course: courseId,
            tutor: req.user._id,
            title,
            description,
            videoUrl,
            videoKey,
            duration,
            thumbnailUrl,
            thumbnailKey,
            pdfUrl,
            pdfKey,
            order: existingCount,
        });

        return res.status(201).json({
            success: true,
            message: `${title} saved`,
            lesson: {
                id: lesson._id,
                title: lesson.title,
                description: lesson.description,
                duration: lesson.duration,
                videoUrl: lesson.videoUrl,
                videoKey: lesson.videoKey,
                thumbnailUrl: lesson.thumbnailUrl,
                thumbnailKey: lesson.thumbnailKey,
                pdfUrl: lesson.pdfUrl,
                pdfKey: lesson.pdfKey,
                order: lesson.order,
            },
        });
    } catch (error) {
        console.error("Create lesson error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save lesson",
        });
    }
};

export const getCourseLessons = async (req, res) => {
    try {
        const { courseId } = req.params;

        // 1️⃣ Validate course ownership
        const course = await Course.findOne({
            _id: courseId,
            tutor: req.user._id,
        }).select("_id");

        if (!course) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You don't own this course",
            });
        }

        // 2️⃣ Fetch lessons sorted by 'order'
        const lessons = await Lesson.find({ course: courseId })
            .select("title description videoUrl videoKey duration thumbnailUrl thumbnailKey pdfUrl pdfKey order")
            .sort({ order: 1 });

        return res.status(200).json({
            success: true,
            lessons,
        });
    } catch (error) {
        console.error("Get lessons error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load lessons",
        });
    }
};

export const updateLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;

        // 1. Optimize DB selection (select only needed fields)
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ success: false, message: "Lesson not found" });
        }

        // 2. Authorization Check
        const course = await Course.findById(lesson.course).select("tutor");
        if (!course || course.tutor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const { title, description, videoUrl, videoKey, duration, thumbnailUrl, thumbnailKey, pdfUrl, pdfKey } = req.body;

        const filesToDelete = [];

        if (title) lesson.title = title.trim();
        if (description) lesson.description = description.trim();

        if (videoUrl && videoUrl !== lesson.videoUrl) {
            if (lesson.videoKey) filesToDelete.push(lesson.videoKey);
            lesson.videoUrl = videoUrl;
            lesson.videoKey = videoKey;
            lesson.duration = duration;
        }

        if (thumbnailUrl && thumbnailUrl !== lesson.thumbnailUrl) {
            if (lesson.thumbnailKey) filesToDelete.push(lesson.thumbnailKey);
            lesson.thumbnailUrl = thumbnailUrl;
            lesson.thumbnailKey = thumbnailKey;
        }

        if (pdfUrl && pdfUrl !== lesson.pdfUrl) {
            if (lesson.pdfKey) filesToDelete.push(lesson.pdfKey);
            lesson.pdfUrl = pdfUrl;
            lesson.pdfKey = pdfKey;
        }

        if (!pdfUrl && lesson.pdfUrl) {
            if (lesson.pdfKey) filesToDelete.push(lesson.pdfKey);
            lesson.pdfUrl = null;
            lesson.pdfKey = null;
        }

        await lesson.save();

        if (filesToDelete.length > 0) {
            Promise.allSettled(filesToDelete.map((key) => deleteFromS3(key))).then((results) => {
                const failures = results.filter((r) => r.status === "rejected");
                if (failures.length > 0) {
                    console.error(
                        `Failed to delete ${failures.length} files from S3:`,
                        failures.map((f) => f.reason)
                    );
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: `${lesson.title} updated successfully`,
            lesson: {
                title: lesson.title,
                description: lesson.description,
                videoUrl: lesson.videoUrl,
                videoKey: lesson.videoKey,
                thumbnailUrl: lesson.thumbnailUrl,
                thumbnailKey: lesson.thumbnailKey,
                pdfUrl: lesson.pdfUrl || "",
                pdfKey: lesson.pdfKey || "",
                duration: lesson.duration,
                order: lesson.order,
            },
        });
    } catch (error) {
        console.error("Lesson update error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update lesson",
        });
    }
};

export const deleteLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;

        // 1️⃣ Find lesson
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
            });
        }

        const course = await Course.findById(lesson.course).select("tutor");
        if (!course || course.tutor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const filesToDelete = [];
        if (lesson.videoKey) filesToDelete.push(lesson.videoKey);
        if (lesson.thumbnailKey) filesToDelete.push(lesson.thumbnailKey);
        if (lesson.pdfKey) filesToDelete.push(lesson.pdfKey);

        await lesson.deleteOne();

        if (filesToDelete.length > 0) {
            Promise.allSettled(filesToDelete.map((key) => deleteFromS3(key))).then((results) => {
                results.forEach((r) => {
                    if (r.status === "rejected") {
                        console.error("Failed to delete from S3:", r.reason);
                    }
                });
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lesson deleted successfully",
        });
    } catch (error) {
        console.error("Delete Lesson Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete lesson",
        });
    }
};
