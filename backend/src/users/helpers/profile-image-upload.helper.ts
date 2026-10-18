import { BadRequestException } from "@nestjs/common";
import { memoryStorage } from "multer";

/**
 * Memory storage for profile images - buffers are streamed directly to Cloudinary
 * without saving temporary files to disk.
 */
export const profileImageStorage = memoryStorage();

/**
 * Filter to allow only specific image formats (JPEG, JPG, PNG, WEBP).
 */
export const profileImageFilter = (
    _req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void
) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const allowedExtension = /\.(jpe?g|png|webp)$/i;

    const isMimeValid = allowedMimeTypes.includes(file.mimetype);
    const isExtValid = allowedExtension.test(file.originalname);

    if (isMimeValid && isExtValid) {
        cb(null, true);
    } else {
        cb(
            new BadRequestException(
                "Invalid file format. Only JPEG, PNG, and WEBP image files are allowed."
            ),
            false
        );
    }
};

/**
 * Full Multer configuration for profile image uploads with MemoryStorage.
 */
export const profileImageUploadOptions = {
    storage: profileImageStorage,
    fileFilter: profileImageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 Megabytes limit
    },
};
