import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ShippingAddress } from './entities/shipping-address.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



  // Get all users
  @Get('all')
  async findAllUsers() {
    return this.userService.findAll();
  }

  @Get('email/:email')
  async findAllUsersbyEmail(@Param('email') email) {
    return this.userService.findOneByEmail(email)
  }

  // Get a specific user by ID
  @Get('detail/:id')
  async findOneUser(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // Update a user by ID
  @Put('update-general-user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // Add a new shipping address for a user
  @Post('add-address/:userId')
  async addShippingAddress(
    @Param('userId') userId: string,
    @Body() newAddress: ShippingAddress,
  ) {
    return this.userService.addShippingAddress(userId, newAddress);
  }

  // Remove a shipping address from a user
  @Delete(':userId/delete-address/:addressId')
  async removeShippingAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.userService.removeShippingAddress(userId, addressId);
  }

  // Change a user's password
  @Post('change-password/:id')
  async changePassword(
    @Param('id') userId: string,
    @Body() {currentPassword, newPassword},
  ) {
    // if (!newPassword || newPassword.length < 6) {
    //   throw new BadRequestException('Password must be at least 6 characters long.');
    // }
    return this.userService.changePassword(userId, newPassword);
  }

  // Change a user's status (activate/deactivate)
  @Put('change-status/:id')
  async changeStatus(
    @Param('id') userId: string,
  ) {
    return this.userService.changeStatus(userId);
  }
}
