import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get('get-all-product')
  @HttpCode(HttpStatus.OK)
  async findAllUnknown(@Query('brand') brand?: string, @Query('category') category?: string) {
    return await this.productService.findAll(brand, category);
  }

  @Get('get-all-product2')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.productService.findAll();
  }

  @Get('get-detail-product/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Get('get-product-by-category-id/:id')
  @HttpCode(HttpStatus.OK)
  async findOneByCategoryId(@Param('id') id: string) {
    return await this.productService.findByCategoryId(id);
  }

  @Put('status/:id')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') productId: string, @Body() {status}: {status: string},
  ) {
    return await this.productService.updateStatus(productId, status);
  }

  @Put('update-price/:id')
  @HttpCode(HttpStatus.OK)
  async updatePrice(
    @Param('id') id: string,
    @Body() {newPrice}: {newPrice: number},
  ) {
    return await this.productService.updatePrice(id, newPrice);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }

  @Post('import')
  async import(@Body() products) {
    return await this.productService.importProducts(products.products)
  }
}
