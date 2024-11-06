import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './entities/cart.entity';
import { Model } from 'mongoose';
import { CategoryDocument } from 'src/category/entities/category.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CategoryDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(userId: string) {
    const existUser = await this.userService.findOne(userId);
    if (!existUser) {
      throw new NotFoundException('Cannot find this user');
    }
    const newCart = new this.cartModel({
      userId,
      cartItems: [],
      totalPrice: 0,
    });
    await newCart.save();
  }

  async addToCart(createCartDto: CreateCartDto) {
    const { cartItem, userId, totalPrice } = createCartDto;
    // Find the cart by userId
    let cart: any = await this.cartModel.findOne({ userId }).exec();
    if (cart) {
      const productIndex = cart.cartItems.findIndex(
        (item) =>
          item.productId.toString() === cartItem.productId &&
          item.color === cartItem.color &&
          item.size === cartItem.size,
      );

      if (productIndex > -1) {
        // If product with the same color and size already exists in cart, update the quantity
        cart.cartItems[productIndex].quantity += cartItem.quantity;
      } else {
        // If product does not exist in cart, add new item
        cart.cartItems.push(cartItem);
      }

      // Update the total price of the cart
      cart.totalPrice += cartItem.price * cartItem.quantity;
    } else {
      // Create a new cart if it doesn't exist
      cart = new this.cartModel({ userId, cartItems: [cartItem], totalPrice });
    }

    await cart.save();
  }

  async getCartByUserId(id: string) {
    try {
      const cart: any = await this.cartModel
      .findOne({ userId: id })
      // .populate('cartItems.productId');
    if (!cart) {
      throw new NotFoundException({ message: 'Cart not found' });
    }
    return {
      id: cart._id,
      userId: cart.userId,
      cartItems: cart.cartItems.length === 0 ? [] : cart.cartItems.map((item) => {
        // Find the color detail for the selected color
        return {
          id: item._id,
          productTitle: item.productTitle,
          productId: item.productId,
          thumbnail: item.thumbnail, 
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        };
      }),
      totalPrice: cart.totalPrice,
    };
    } catch (error) {
      console.log(error)
    }
  }

  async removeOrderItem(userId: string, orderedItems) {
    console.log(orderedItems + " " + userId);
    let cart: any = await this.cartModel.findOne({ userId });
    if (!cart) {
      throw new NotFoundException("Cart not found");
    }
    // Remove ordered items from cart
    cart.cartItems = cart.cartItems.filter(
      (cartItem) => !orderedItems.some((orderedItem) => orderedItem.productId === cartItem.productId.toString() && orderedItem.color === cartItem.color && orderedItem.size === cartItem.size),
    );
    // Recalculate total price
    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const updatedCart = await cart.save();
    return updatedCart;
  }
}
