import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { Readable } from "node:stream";

@Injectable()
export class CloudinaryService {
    private readonly logger = new Logger(CloudinaryService.name);

    /**
     * Uploads an image buffer directly to Cloudinary using streams (Memory Storage).
     * @param file Express.Multer.File with memory buffer
     * @param folder Cloudinary folder path (e.g. 'planto/profiles' or 'planto/products')
     */
    async uploadImage(
        file: Express.Multer.File,
        folder: string
    ): Promise<UploadApiResponse> {
        if (!file || !file.buffer) {
            throw new BadRequestException("No image buffer found for upload");
        }

        return new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "image",
                },
                (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
                    if (error) {
                        this.logger.error("Cloudinary upload failed:", error);
                        return reject(new BadRequestException(`Image upload failed: ${error.message}`));
                    }
                    if (!result) {
                        return reject(new BadRequestException("Image upload failed: empty response"));
                    }
                    resolve(result);
                }
            );

            Readable.from(file.buffer).pipe(uploadStream);
        });
    }

    /**
     * Deletes an image from Cloudinary using its public_id or its full secure URL.
     */
    async deleteImage(publicIdOrUrl: string): Promise<boolean> {
        try {
            const publicId = this.extractPublicId(publicIdOrUrl);
            if (!publicId) {
                return false;
            }

            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === "ok";
        } catch (error) {
            this.logger.warn(`Failed to delete image "${publicIdOrUrl}" from Cloudinary:`, error);
            return false;
        }
    }

    /**
     * Extracts Cloudinary public_id from a secure URL or returns the input if already a public_id.
     * Example: https://res.cloudinary.com/planto/image/upload/v1729258900/planto/profiles/user-123.jpg
     * Returns: planto/profiles/user-123
     */
    extractPublicId(urlOrId: string): string {
        if (!urlOrId.includes("cloudinary.com")) {
            return urlOrId;
        }

        try {
            const afterUpload = urlOrId.split("/upload/")[1];
            if (!afterUpload) return urlOrId;

            // Remove version tag (e.g. 'v1729258900/')
            const withoutVersion = afterUpload.replace(/^v\d+\//, "");

            // Remove file extension (e.g. '.jpg', '.png')
            const lastDotIndex = withoutVersion.lastIndexOf(".");
            if (lastDotIndex !== -1) {
                return withoutVersion.substring(0, lastDotIndex);
            }

            return withoutVersion;
        } catch {
            return urlOrId;
        }
    }
}
