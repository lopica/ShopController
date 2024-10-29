import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  addProductToCart(createCartDto: CreateCartDto) {
    return 'This action adds a new cart';
  }

  findOneByUserId(id: number) {
    return `This action returns a #${id} cart`;
  }

  removeItem(userId: string, itemId: string) {
  }

  removeAllItems(userId: string) {
  }
}
