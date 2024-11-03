import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
async create(@Body() body: { userId: string }) {
  const { userId } = body; 
  return await this.cartService.create(userId);
}


  @Post()
  addProductToCart(@Body() createCartDto: CreateCartDto) {
    
  }

  @Post()
  removeOrderItem(@Body() createCartDto: CreateCartDto) {

  }

  @Post()
  removeItem(@Body() createCartDto: CreateCartDto) {

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  }

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
