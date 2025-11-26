import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    register(dto: CreateUserDto): Promise<{
        user: import("../user/dto/user.dto").UserDto;
        accessToken: string;
    }>;
}
