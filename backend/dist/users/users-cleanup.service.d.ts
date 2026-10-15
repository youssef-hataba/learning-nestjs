import { Repository } from "typeorm";
import { User } from "./user.entity.js";
export declare class UsersCleanupService {
    private readonly usersRepository;
    private readonly logger;
    constructor(usersRepository: Repository<User>);
    handleExpiredAccountCleanup(): Promise<void>;
}
