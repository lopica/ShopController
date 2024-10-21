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
} from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTypeDto: CreateTypeDto) {
    return await this.typeService.create(createTypeDto);
  }

  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.typeService.findAll();
  }

  @Get('get-details/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.typeService.findOne(id);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateTypeDto: UpdateTypeDto,
  ) {
    return await this.typeService.update(id, updateTypeDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.typeService.remove(id);
  }
}
