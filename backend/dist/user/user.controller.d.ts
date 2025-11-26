import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(dto: CreateUserDto): Promise<import("./dto/user.dto").UserDto>;
    findAll(q: QueryUserDto): Promise<{
        items: import("./dto/user.dto").UserDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("./dto/user.dto").UserDto>;
    update(id: string, dto: UpdateUserDto): Promise<import("./dto/user.dto").UserDto>;
    deactivate(id: string): Promise<{
        deactivated: true;
    }>;
}
