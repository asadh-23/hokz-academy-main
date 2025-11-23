import dotenv from "dotenv";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// ----------------------------------
// Upload File to S3
// ----------------------------------
export const uploadToS3 = async (file, folder) => {
    if (!file) throw new Error("No file provided");

    const ext = file.originalname.split(".").pop();
    const key = `${folder}/${randomUUID()}.${ext}`;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        await s3Client.send(new PutObjectCommand(params));

        const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return { key, url };
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new Error("S3 upload failed");
    }
};

// ----------------------------------
// Delete File from S3
// ----------------------------------
export const deleteFromS3 = async (key) => {
    if (!key) return;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    };

    try {
        await s3Client.send(new DeleteObjectCommand(params));
    } catch (error) {
        console.error("S3 Delete Error:", error);
    }
};
