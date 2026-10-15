export declare const PROFILE_IMAGES_DIR: string;
export declare const profileImageStorage: import("multer").StorageEngine;
export declare const profileImageFilter: (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => void;
export declare const profileImageUploadOptions: {
    storage: import("multer").StorageEngine;
    fileFilter: (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => void;
    limits: {
        fileSize: number;
    };
};
