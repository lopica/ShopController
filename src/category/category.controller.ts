import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpStatus,
  HttpException,
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
  @ApiOperation({ summary: 'Tạo danh mục sản phẩm' })
  @ApiBody({
    type: CreateCategoryDto,
    // description: 'Data to create a new category',
    examples: {
      example1: {
        summary: 'Ví dụ request 1',
        value: {
          name: 'Quần áo nam',
          status: true,
        },
      },
      example2: {
        summary: 'Ví dụ request 2',
        value: {
          name: 'Quần áo nam',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    // description: 'Tạo danh mục thành công',
    example: {
      status: HttpStatus.CREATED,
      message: 'Tạo danh mục thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    // description: 'Category created fail because of invalid input.',
    example: {
      status: HttpStatus.BAD_REQUEST,
      message: 'thông báo lỗi',
    },
  })
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    if (this.categoryService.findOne(createCategoryDto.name)) {
      throw new HttpException(
        'Tên danh mục đã tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.categoryService.create(createCategoryDto);
    return {
      status: HttpStatus.CREATED,
      message: 'Tạo danh mục thành công',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả danh mục' })
  @ApiResponse({
    status: HttpStatus.OK,
    // description: 'Categories retrieved successfully',
    example: {
      status: HttpStatus.OK,
      message: 'Lấy danh mục thành công',
      data: [
        {
          _id: '66f147291dcde2a91924bc35',
          name: 'cate1',
          status: false,
          createdAt: '2024-09-23T10:47:05.068Z',
          updatedAt: '2024-09-23T10:47:05.068Z',
          __v: 0,
        },
        {
          _id: '66f16a154a8c1d3b3498afde',
          name: 'cate2',
          status: false,
          createdAt: '2024-09-23T13:16:05.748Z',
          updatedAt: '2024-09-23T13:19:56.746Z',
          __v: 0,
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    // description: 'No categories found',
    example: {
      status: HttpStatus.NOT_FOUND,
      message: 'Không tìm thấy danh mục nào',
    },
  })
  async findAll() {
    const categories = await this.categoryService.findAll();

    if (!categories || categories.length === 0) {
      throw new HttpException(
        'Không tìm thấy danh mục nào',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: HttpStatus.OK,
      message: 'Lấy danh mục thành công',
      data: categories,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật tên hoặc trạng thái danh mục' })
  @ApiBody({
    type: UpdateCategoryDto,
    examples: {
      example1: {
        summary: 'Ví dụ request 1',
        value: {
          name: 'Quần áo nữ',
          status: false,
        },
      },
      example2: {
        summary: 'Ví dụ request 2',
        value: {
          name: 'Quần áo nữ',
        },
      },
      example3: {
        summary: 'Ví dụ request 3',
        value: {
          status: false,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    // description: 'Category updated successfully.',
    schema: {
      example: {
        status: HttpStatus.OK,
        message: 'Sửa đổi danh mục thành công',
        data: {
          _id: '66f147291dcde2a91924bc35',
          name: 'Updated Category',
          status: true,
          createdAt: '2024-09-23T10:47:05.068Z',
          updatedAt: '2024-09-23T12:47:05.068Z',
          __v: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    // description: 'Category not found.',
    schema: {
      example: {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy danh mục cần sửa đổi',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    // description: 'error message',
    schema: {
      example: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Thông báo lỗi',
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    const updatedCategory = await this.categoryService.update(
      id,
      updateCategoryDto,
    );

    if (!updatedCategory) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Không tìm thấy danh mục cần sửa đổi',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: HttpStatus.OK,
      message: 'Cập nhật danh mục thành công',
      data: updatedCategory,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa danh mục' })
  @ApiResponse({
    status: 200,
    // description: 'Xóa danh mục thành công',
    schema: {
      example: {
        status: 200,
        message: 'Xóa danh mục thành công',
      },
    },
  })
  @ApiResponse({
    status: 404,
    // description: 'Category not found.',
    schema: {
      example: {
        status: 404,
        message: 'Không tìm thấy danh mục để xóa',
      },
    },
  })
  async remove(@Param('id') id: string) {
    const result = await this.categoryService.remove(id);

    if (!result) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Không tìm thấy danh mục để xóa',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      status: HttpStatus.OK,
      message: 'Xóa danh mục thành công',
    };
  }
}
