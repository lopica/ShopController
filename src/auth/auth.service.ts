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
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async login(user: any) {
    // console.log('User payload:', user);
    if (!user.email || !user._id.toString()) {
      throw new BadRequestException('Invalid user payload for JWT');
    }
    const payload = {
      email: user.email,
      role: user.role,
      id: user._id,
      name: user.name, 
      phone: user.phone,
      gender: user.gender,
      shippingAddress: user.shippingAddress,
    };
    // console.log(payload)
    try {
      return {
        access_token: this.jwtService.sign(payload, {
          secret: process.env.SECRET_KEY_JWT,
          expiresIn: process.env.EXPIRE_TIME,
        }),
      };
    } catch (error) {
      console.log(error);
    }
  }
}
