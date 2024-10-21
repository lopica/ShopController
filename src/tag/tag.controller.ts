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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTagDto: CreateTagDto) {
    return await this.tagService.create(createTagDto);
  }

  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.tagService.findAll();
  }

  @Get('get-details/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.tagService.findOne(id);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return await this.tagService.update(id, updateTagDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.tagService.remove(id);
  }
}
