import { BadRequestException } from "@nestjs/common";
import { memoryStorage } from "multer";

export const MAX_PRODUCT_IMAGES = 5;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Memory storage for product images - buffers are streamed directly to Cloudinary
 * without saving temporary files to disk.
 */
export const productImagesStorage = memoryStorage();

/**
 * Filter to allow only specific image formats (JPEG, JPG, PNG, WEBP).
 */
export const productImagesFilter = (
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
 * Full Multer configuration for product images upload with MemoryStorage.
 */
export const productImagesUploadOptions = {
    storage: productImagesStorage,
    fileFilter: productImagesFilter,
    limits: {
        fileSize: MAX_IMAGE_SIZE_BYTES,
    },
};
