import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './entities/cart.entity';
import { Model } from 'mongoose';
import { CategoryDocument } from 'src/category/entities/category.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CategoryDocument>,
  private readonly userService: UserService) {}

  async create(userId: string) {
    const existUser = await this.userService.findOne(userId)
    if (!existUser) {
      throw new NotFoundException('Cannot find this user')
    }
    const newCart = new this.cartModel({ userId, cartItems: [], totalPrice: 0 })
    await newCart.save()
  }

  async addToCart(createCartDto: CreateCartDto) {
    const { cartItem, userId, totalPrice } = createCartDto;

    // Find the cart by userId
    let cart = await this.cartModel.findOne({ userId }).exec();
    if (cart) {
     
    } else {
      // Create a new cart if it doesn't exist
    }

    const savedCart = await cart.save();
  }
}
