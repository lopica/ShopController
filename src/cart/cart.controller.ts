import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':id')
  @ApiOperation({ summary: 'Add product to cart' })
  addToCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get all product in cart' })
  findAll() {
    return this.cartService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product\'s quantity' })
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove all product from cart' })
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
