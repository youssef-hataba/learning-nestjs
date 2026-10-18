import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { User } from "../user.entity.js";
import { PROFILE_IMAGES_DIR } from "../helpers/profile-image-upload.helper.js";

@Injectable()
export class ProfileImageService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    private async findUserOrThrow(userId: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    private deleteImageFileFromDisk(filename: string): void {
        try {
            const filePath = path.join(PROFILE_IMAGES_DIR, filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error(`Failed to delete profile image "${filename}" from disk:`, error);
        }
    }

    async setProfileImage(userId: string, filename: string): Promise<{ message: string; profileImage: string }> {
        const user = await this.findUserOrThrow(userId);
        const isUpdated = Boolean(user.profileImage);

        // If user already has an image on disk, remove it before setting the new one
        if (user.profileImage) {
            this.deleteImageFileFromDisk(user.profileImage);
        }

        user.profileImage = filename;
        await this.usersRepository.save(user);

        return {
            message: isUpdated ? "Profile image updated successfully" : "Profile image set successfully",
            profileImage: filename,
        };
    }

    async removeProfileImage(userId: string): Promise<{ message: string }> {
        const user = await this.findUserOrThrow(userId);

        if (!user.profileImage) {
            throw new BadRequestException("User does not have a profile image to remove");
        }

        // Delete image file from disk
        this.deleteImageFileFromDisk(user.profileImage);

        user.profileImage = null;
        await this.usersRepository.save(user);

        return {
            message: "Profile image removed successfully",
        };
    }

    async getProfileImagePath(userId: string): Promise<string> {
        const user = await this.findUserOrThrow(userId);

        if (!user.profileImage) {
            throw new NotFoundException("User does not have a profile image");
        }

        const filePath = path.join(PROFILE_IMAGES_DIR, user.profileImage);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException("Profile image file not found on disk");
        }

        return filePath;
    }
}
