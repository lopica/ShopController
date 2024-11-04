import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import { ShippingAddress } from './entities/shipping-address.entity';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import { RoleService } from 'src/role/role.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly roleService: RoleService,
    @Inject(forwardRef(() => CartService)) private readonly cartService: CartService,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    const {role} = createUserDto
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use.');
    }
    const existingRole = await this.roleService.findByName(role)
    if (!existingRole) {
      throw new NotFoundException('Role is not exist')
    }
    // Hash the password before saving
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel(createUserDto);
    const saveUser: any = createdUser.save();
    if (saveUser) {
      const userId = createdUser._id.toString();
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException({ message: "Email and User not found." });
      }
      await this.cartService.create(userId);
    }
  }

  // Find all users
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec(); // Populate role reference
  }

  // Find one user by ID
  async findOne(id: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format.');
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    if (!isEmail(email)) {
      throw new BadRequestException('Invalid email format.');
    }
    const user = await this.userModel
      .findOne({ email })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }
    return user;
  }

  // Update user details
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format.');
    }

    // If password is included in update, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return updatedUser;
  }

  // Remove a specific shipping address
  async removeShippingAddress(
    userId: string,
    addressId: string,
  ): Promise<UserDocument> {
    const user = await this.findOne(userId);
    user.shippingAddress = user.shippingAddress.filter(
      (address) => address._id.toString() !== addressId,
    );
    return user.save();
  }

  // Add a new shipping address
  async addShippingAddress(
    userId: string,
    newAddress: ShippingAddress,
  ): Promise<UserDocument> {
    const user = await this.findOne(userId);
    user.shippingAddress.push(newAddress);
    return user.save();
  }

  // Change user password
  async changePassword(
    userId: string,
    newPassword: string,
  ): Promise<UserDocument> {
    const user = await this.findOne(userId);
    user.password = await bcrypt.hash(newPassword, 10);
    return user.save();
  }

  // Change user status
  async changeStatus(userId: string): Promise<UserDocument> {
    const user = await this.findOne(userId);
    user.status = !user.status;
    return user.save();
  }
}
