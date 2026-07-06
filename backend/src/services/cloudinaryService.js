import cloudinary from "../config/cloudinary.js";
import { randomUUID } from "crypto";

/**
 * Upload file to Cloudinary
 * Supports images, videos, PDFs, and other raw files
 * @param {Buffer} buffer - File buffer
 * @param {String} folder - Cloudinary folder path
 * @param {String} resourceType - 'image', 'video', 'raw', or 'auto'
 * @param {String} originalname - Original filename (for extension)
 * @returns {Promise<Object>} - {url, publicId}
 */
export const uploadToCloudinary = (buffer, folder, resourceType = "auto", originalname = "") => {
  return new Promise((resolve, reject) => {
    // Generate unique filename
    const ext = originalname.split(".").pop();
    const filename = `${randomUUID()}`;
    
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      public_id: filename,
      // For videos, enable streaming and optimization
      ...(resourceType === "video" && {
        chunk_size: 6000000, // 6MB chunks for large videos
        eager: [
          { streaming_profile: "full_hd", format: "m3u8" }, // HLS streaming
          { format: "mp4", transformation: [{ quality: "auto" }] }
        ],
        eager_async: true,
      }),
      // For PDFs and other documents
      ...(resourceType === "raw" && {
        format: ext,
      }),
      // Enable automatic format optimization for images
      ...(resourceType === "image" && {
        quality: "auto",
        fetch_format: "auto",
      }),
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes,
          duration: result.duration || null, // For videos
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @param {String} resourceType - 'image', 'video', or 'raw'
 */
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    
    console.log(`Cloudinary delete result for ${publicId}:`, result.result);
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw error;
  }
};

/**
 * Get optimized/transformed URL for Cloudinary asset
 * Useful for thumbnails, responsive images, etc.
 * @param {String} publicId - Cloudinary public ID
 * @param {Object} transformations - Cloudinary transformation options
 */
export const getCloudinaryUrl = (publicId, transformations = {}) => {
  if (!publicId) return null;
  
  try {
    return cloudinary.url(publicId, {
      secure: true,
      ...transformations,
    });
  } catch (error) {
    console.error("Cloudinary URL Error:", error);
    return null;
  }
};

/**
 * Get video streaming URL
 * @param {String} publicId - Cloudinary public ID of video
 */
export const getVideoStreamingUrl = (publicId) => {
  if (!publicId) return null;
  
  return cloudinary.url(publicId, {
    resource_type: "video",
    streaming_profile: "full_hd",
    format: "m3u8",
    secure: true,
  });
};