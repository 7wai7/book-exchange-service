import { User, UserCreationAttrs } from "./models/user.model";

class UserService {
    async create(data: UserCreationAttrs) {
        return await User.create(data);
    }

    async findOne(options: Partial<Omit<UserCreationAttrs, "password">>) {
        return await User.findOne({ where: options });
    }
}

export const userService = new UserService();