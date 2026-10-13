import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import * as fs from "fs";
import * as path from "path";

export const PRODUCT_IMAGES_DIR = path.resolve(process.cwd(), "uploads", "products");

// Ensure the upload directory exists
if (!fs.existsSync(PRODUCT_IMAGES_DIR)) {
    fs.mkdirSync(PRODUCT_IMAGES_DIR, { recursive: true });
}

export const MAX_PRODUCT_IMAGES = 5;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Custom disk storage for product images.
 * Naming format: product-<productId>-<timestamp>-<random>.<ext>
 */
export const productImagesStorage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, PRODUCT_IMAGES_DIR);
    },
    filename: (req: any, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const productId = req.params?.id || "product";
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `product-${productId}-${uniqueSuffix}${ext}`;
        cb(null, filename);
    },
});

/**
 * Filter to allow only specific image formats (JPEG, JPG, PNG, WEBP).
 */
export const productImagesFilter = (
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
 * Full Multer configuration for product images upload.
 */
export const productImagesUploadOptions = {
    storage: productImagesStorage,
    fileFilter: productImagesFilter,
    limits: {
        fileSize: MAX_IMAGE_SIZE_BYTES,
    },
};
