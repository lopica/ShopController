import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpException,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { v2 as cloudinary } from 'cloudinary';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CategoryService } from 'src/category/category.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as multer from 'multer'; // Correct import

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'pro1' },
        title: { type: 'string', example: 'pro1' },
        description: { type: 'string', example: 'Description of pro1' },
        price: { type: 'number', example: 100000 },
        category_id: { type: 'string', example: '66fa23ecdaa787cbeace6c1a' },
        colors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'red' },
              status: { type: 'boolean', example: false },
            },
          },
        },
        sizes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                // enum: ['S', 'M', 'L', 'XL','2XL'],
                example: 'M',
              },
              status: { type: 'boolean', example: false },
            },
          },
        },
        discount: { type: 'number', example: 0.2, nullable: true },
        rating: { type: 'number', example: 4, nullable: true },
        stock: { type: 'number', example: 10, nullable: true },
        status: { type: 'boolean', example: true },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary', // Indicates that this is a file input
          },
        },
        thumbnail: { type: 'string', format: 'binary', nullable: true }, // Thumbnail image
        events: {
          type: 'array',
          items: { type: 'string', example: '66fa23ecdaa787cbeace6c1a' },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully.',
    schema: {
      example: {
        status: 201,
        message: 'Product created successfully',
        data: {
          name: 'pro1',
          title: 'pro1',
          description: 'description of pro1',
          price: 100000,
          category_id: '66fa23ecdaa787cbeace6c1a',
          colors: [
            {
              name: 'red',
              status: false,
            },
          ],
          sizes: [
            {
              name: 'M',
              status: false,
            },
          ],
          discount: 0.2,
          rating: 2,
          stock: 4,
          status: false,
          images: [],
          thumbnail: 'https://example.com/image.jpg',
          events: [],
          createdAt: '2024-09-23T10:47:05.068Z',
          updatedAt: '2024-09-23T10:47:05.068Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Product creation failed due to invalid input.',
    schema: {
      example: {
        status: 400,
        message: 'error message',
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 }, // Accept up to 10 images
        { name: 'thumbnail', maxCount: 1 }, // Accept up to 10 images
      ],
      {
        storage: multer.memoryStorage(),
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ) {
    const categoryIDs = createProductDto.category_id;

    // Check if the category exists
    for (let id in categoryIDs) {
      if (!this.categoryService.findById(id)) {
        throw new HttpException(
          'ID của danh mục không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    // Handle the thumbnail upload
    let uploadedThumbnailUrl = '';
    if (files?.thumbnail && files.thumbnail[0]) {
      // Generate a meaningful name for the thumbnail
      const thumbnailName = `thumbnail-${Date.now()}`;
      const uploadedThumbnail = await this.cloudinaryService.uploadImageBuffer(
        files.thumbnail[0].buffer,
        thumbnailName,
      );
      console.log('Thumbnail uploaded:', uploadedThumbnail);
      uploadedThumbnailUrl = uploadedThumbnail.secure_url; // Access the secure URL
    }

    // Handle the images upload
    const uploadedImagesUrls: string[] = [];
    if (files?.images && files.images.length > 0) {
      for (const image of files.images) {
        const imageName = `image-${Date.now()}`; // Customize image name as needed
        const uploadedImage = await this.cloudinaryService.uploadImageBuffer(
          image.buffer,
          imageName,
        );
        uploadedImagesUrls.push(uploadedImage.secure_url); // Add the image URL to the array
      }
    }

    // Now pass the createProductDto to the product service to create the product
    const createdProduct = await this.productService.create({
      ...createProductDto,
      images: [...uploadedImagesUrls],
      thumbnail: uploadedThumbnailUrl,
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Product created successfully',
      data: createdProduct, // Return the newly created product
    };
  }

  @Get()
  @ApiOperation({ summary: 'Search product' })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'category_name', required: false, type: String })
  @ApiQuery({ name: 'color', required: false, type: String })
  @ApiQuery({ name: 'size', required: false, type: String })
  @ApiQuery({
    name: '_page',
    required: false,
    type: String,
    description: 'Page number',
  })
  @ApiQuery({
    name: '_per_page',
    required: false,
    type: String,
    description: 'Items per page',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
    example: {
      status: HttpStatus.OK,
      message: 'Products retrieved successfully',
      data: [
        {
          name: 'pro1',
          title: 'pro1',
          description: 'description of pro1',
          price: 100000,
          category_id: '66fa23ecdaa787cbeace6c1a',
          colors: [
            {
              name: 'red',
              status: false,
            },
          ],
          sizes: [
            {
              size: 'm',
              status: false,
            },
          ],
          discount: 0.2,
          rating: 2,
          stock: 4,
          status: false,
          images: [],
          thumbnail: 'https://example.com/image.jpg',
          events: [],
          createdAt: '2024-09-23T10:47:05.068Z',
          updatedAt: '2024-09-23T10:47:05.068Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No products found',
    example: {
      status: HttpStatus.NOT_FOUND,
      message: 'No products found',
    },
  })
  async search(
    @Query('_page') _page: string,
    @Query('_per_page') _per_page: string,
    @Query('name') name?: string,
    @Query('category_id') category_id?: string,
    @Query('color') color?: string,
    @Query('size') size?: string,
  ) {
    const page = parseInt(_page, 10) || 1;
    const perPage = parseInt(_per_page, 10) || 10;
    // return null
    const result = await this.productService.search(page, perPage, {
      name,
      category_id,
      color,
      size,
    });

    if (result.length === 0)
      throw new HttpException(
        'Không tìm thấy sản phẩm nào',
        HttpStatus.NOT_FOUND,
      );
    return {
      status: HttpStatus.OK,
      message: 'Product retrieved successfully',
      data: result,
    };
  }

  @Get('hot')
  @ApiOperation({ summary: 'Get hot product' })
  findHotProduct() {}

  @Get(':id')
  @ApiOperation({ summary: "Get product's detail" })
  async findOneDetail(@Param('id') id: string) {
    const result = await this.productService.findOneDetail(id);
    if (!result)
      throw new HttpException(
        'Không tìm thấy sản phẩm nào',
        HttpStatus.NOT_FOUND,
      );
    return {
      status: HttpStatus.OK,
      message: 'Product retrieved successfully',
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update product's detail" })
  updateProductDetail(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  async remove(@Param('id') id: string) {
    const result = await this.productService.delete(id);
    return {
      status: HttpStatus.OK,
      message: 'Product deleted successfully',
      data: result,
    };
  }
}
