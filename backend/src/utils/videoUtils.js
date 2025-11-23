import ffmpeg from "fluent-ffmpeg";
import ffprobe from "ffprobe-static";
import { Readable } from "stream";

function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

export const getVideoDuration = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        ffmpeg(bufferToStream(fileBuffer))
            .setFfprobePath(ffprobe.path)
            .ffprobe((err, data) => {
                if (err) return reject(err);
                const duration = data?.format?.duration || 0;
                resolve(Math.floor(duration));
            });
    });
};
