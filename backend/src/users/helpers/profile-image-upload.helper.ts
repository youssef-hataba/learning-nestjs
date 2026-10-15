import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import * as fs from "fs";
import * as path from "path";

export const PROFILE_IMAGES_DIR = path.resolve(process.cwd(), "uploads", "profile-images");

// Ensure the upload directory exists
if (!fs.existsSync(PROFILE_IMAGES_DIR)) {
    fs.mkdirSync(PROFILE_IMAGES_DIR, { recursive: true });
}

/**
 * Custom disk storage using user-<userId>-profile.<ext> naming format.
 */
export const profileImageStorage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, PROFILE_IMAGES_DIR);
    },
    filename: (req: any, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const userId = req.user?.userId;
        const filename = userId ? `user-${userId}-profile${ext}` : `user-${Date.now()}-profile${ext}`;
        cb(null, filename);
    },
});

/**
 * Filter to allow only specific image formats (JPEG, JPG, PNG, WEBP).
 */
export const profileImageFilter = (
    req: any,
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
 * Full Multer configuration for profile image uploads.
 */
export const profileImageUploadOptions = {
    storage: profileImageStorage,
    fileFilter: profileImageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 Megabytes limit
    },
};
