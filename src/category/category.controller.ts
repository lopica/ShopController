import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: "Create new products's category" })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Data to create a new category',
    examples: {
      example1: {
        summary: 'Valid category creation example 1',
        value: {
          name: 'Quần áo nam',
          status: true,
        },
      },
      example2: {
        summary: 'Valid category creation example 2',
        value: {
          name: 'Quần áo nam',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully.',
    example: {
      status: 201,
      message: 'create successfully',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Category created fail because of invalid input.',
    example: {
      status: 400,
      message: 'the input error',
    },
  })
  create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all products's categories" })
  @ApiResponse({
    status: 200,
    description: 'Category find successfully.',
    example: {
      status: 200,
      message: 'find successfully',
      data: [
        {
          "_id": "66f147291dcde2a91924bc35",
          "name": "cate2",
          "status": false,
          "createdAt": "2024-09-23T10:47:05.068Z",
          "updatedAt": "2024-09-23T10:47:05.068Z",
          "__v": 0
        },
        {
          "_id": "66f16a154a8c1d3b3498afde",
          "name": "cate1",
          "status": false,
          "createdAt": "2024-09-23T13:16:05.748Z",
          "updatedAt": "2024-09-23T13:19:56.746Z",
          "__v": 0
        }
      ]
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Category find nothing.',
    example: {
      status: 404,
      message: 'find nothing',
    },
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category updated successfully.' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
