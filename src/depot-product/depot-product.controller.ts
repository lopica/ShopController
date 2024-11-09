import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DepotProductService } from './depot-product.service';
import { CreateDepotProductDto } from './dto/create-depot-product.dto';
import { UpdateDepotProductDto } from './dto/update-depot-product.dto';

@Controller('depotProduct')
export class DepotProductController {
  constructor(private readonly depotProductService: DepotProductService) {}

  @Post()
  create(@Body() createDepotProductDto: CreateDepotProductDto) {
    return this.depotProductService.create(createDepotProductDto);
  }

  @Get('get-all-product')
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.depotProductService.findAll(page, limit);
  }

  @Get('get-product-detail/:id')
  findOne(@Param('id') id: string) {
    return this.depotProductService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepotProductDto: UpdateDepotProductDto) {
    return this.depotProductService.update(id, updateDepotProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depotProductService.remove(id);
  }
}
