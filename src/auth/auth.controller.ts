import {
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body) {
    const { email, password } = body;

    // 1. Validate the user's credentials
    const user = await this.authService.validateUser(email, password);

    // 2. Handle invalid credentials
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Generate a JWT or session token for the user
    return this.authService.login(user); // Return JWT or token
  }

  @Get('logout')
  async logout(@Request() req) {
    // Implement logout functionality depending on your JWT strategy
    console.log(req)
  }
}
