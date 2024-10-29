import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      console.warn(`User with email ${email} not found.`);
      return null;
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log('User payload:', user._doc.email);
    if (!user._doc.email || !user._doc._id.toString()) {
      throw new BadRequestException('Invalid user payload for JWT');
    }
    const payload = { email: user._doc.email, sub: user._doc._id.toString() };
    console.log(payload)
    try {
      return {
        access_token: this.jwtService.sign(payload, {secret: process.env.SECRET_KEY_JWT}),
      };
    } catch (error) {
      console.log(error)
    }
  }
}
