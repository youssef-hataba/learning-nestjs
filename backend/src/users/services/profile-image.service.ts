import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user.entity.js";
import { CloudinaryService } from "../../cloudinary/cloudinary.service.js";

@Injectable()
export class ProfileImageService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    private async findUserOrThrow(userId: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    /**
     * Uploads user's profile image to Cloudinary and saves secure URL.
     * Automatically cleans up previous Cloudinary asset if replaced.
     */
    async setProfileImage(
        userId: string,
        file: Express.Multer.File
    ): Promise<{ message: string; profileImage: string }> {
        const user = await this.findUserOrThrow(userId);
        const isUpdated = Boolean(user.profileImage);

        // Delete old image from Cloudinary if it was previously uploaded
        if (user.profileImage) {
            await this.cloudinaryService.deleteImage(user.profileImage);
        }

        // Upload buffer directly to Cloudinary
        const uploadResult = await this.cloudinaryService.uploadImage(file, "planto/profiles");

        user.profileImage = uploadResult.secure_url;
        await this.usersRepository.save(user);

        return {
            message: isUpdated ? "Profile image updated successfully" : "Profile image set successfully",
            profileImage: uploadResult.secure_url,
        };
    }

    /**
     * Deletes the user's profile image from Cloudinary and clears DB record.
     */
    async removeProfileImage(userId: string): Promise<{ message: string }> {
        const user = await this.findUserOrThrow(userId);

        if (!user.profileImage) {
            throw new BadRequestException("User does not have a profile image to remove");
        }

        await this.cloudinaryService.deleteImage(user.profileImage);

        user.profileImage = null;
        await this.usersRepository.save(user);

        return {
            message: "Profile image removed successfully",
        };
    }

    /**
     * Retrieves the profile image URL (Cloudinary or Google OAuth CDN).
     */
    async getProfileImageUrl(userId: string): Promise<string> {
        const user = await this.findUserOrThrow(userId);

        if (!user.profileImage) {
            throw new NotFoundException("User does not have a profile image");
        }

        return user.profileImage;
    }
}
