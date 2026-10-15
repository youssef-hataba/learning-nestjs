import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import * as fs from "fs";
import * as path from "path";
export const PROFILE_IMAGES_DIR = path.resolve(process.cwd(), "uploads", "profile-images");
if (!fs.existsSync(PROFILE_IMAGES_DIR)) {
    fs.mkdirSync(PROFILE_IMAGES_DIR, { recursive: true });
}
export const profileImageStorage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, PROFILE_IMAGES_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const userId = req.user?.userId;
        const filename = userId ? `user-${userId}-profile${ext}` : `user-${Date.now()}-profile${ext}`;
        cb(null, filename);
    },
});
export const profileImageFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const allowedExtension = /\.(jpe?g|png|webp)$/i;
    const isMimeValid = allowedMimeTypes.includes(file.mimetype);
    const isExtValid = allowedExtension.test(file.originalname);
    if (isMimeValid && isExtValid) {
        cb(null, true);
    }
    else {
        cb(new BadRequestException("Invalid file format. Only JPEG, PNG, and WEBP image files are allowed."), false);
    }
};
export const profileImageUploadOptions = {
    storage: profileImageStorage,
    fileFilter: profileImageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
};
//# sourceMappingURL=profile-image-upload.helper.js.map