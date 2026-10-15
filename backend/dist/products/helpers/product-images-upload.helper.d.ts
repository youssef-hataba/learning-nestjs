export declare const PRODUCT_IMAGES_DIR: string;
export declare const MAX_PRODUCT_IMAGES = 5;
export declare const MAX_IMAGE_SIZE_BYTES: number;
export declare const productImagesStorage: import("multer").StorageEngine;
export declare const productImagesFilter: (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => void;
export declare const productImagesUploadOptions: {
    storage: import("multer").StorageEngine;
    fileFilter: (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => void;
    limits: {
        fileSize: number;
    };
};
