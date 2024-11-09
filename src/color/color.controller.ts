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
  UseGuards,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { JWTGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post('create')
  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin') 
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createColorDto: CreateColorDto) {
    return await this.colorService.create(createColorDto);
  }

  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.colorService.findAll();
  }

  @Get('get-details/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.colorService.findOne(id);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
  ) {
    return await this.colorService.update(id, updateColorDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.colorService.remove(id);
  }
}
