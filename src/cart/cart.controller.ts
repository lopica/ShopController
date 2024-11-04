import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('create-cart')
  async create(@Body() body: { userId: string }) {
    const { userId } = body;
    return await this.cartService.create(userId);
  }

  @Post('add-product-to-cart')
  async addProductToCart(@Body() createCartDto: CreateCartDto) {
    await this.cartService.addToCart(createCartDto);
  }

  @Get('get-cart-by-user-id/:id')
  async findOne(@Param('id') id: string) {
    return await this.cartService.getCartByUserId(id)
  }

  @Post()
  removeOrderItem(@Body() createCartDto: CreateCartDto) {}

  @Post()
  removeItem(@Body() createCartDto: CreateCartDto) {}


  // @Get()
  // findAll() {

  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  // }
}
