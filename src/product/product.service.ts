import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas/product.schema';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    const { category_id } = createProductDto;

    // Check if the category exists
    const categoryExists = await this.categoryModel.findById(category_id);

    if (!categoryExists) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Category does not exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdProduct = new this.productModel(createProductDto);
    return await createdProduct.save();
  }

  async search(page: number, perPage: number, filters: { name?: string, category_id?: string, color?: string, size?: string }) {
    const skip = (page - 1) * perPage; // Calculate how many documents to skip
  
    // Build the query object based on the provided filters
    const query: any = {};
    
    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' }; // Case-insensitive name search
    }
    if (filters.category_id) {
      query.category_id = filters.category_id;
    }
    if (filters.color) {
      query.color = filters.color;
    }
    if (filters.size) {
      query.size = filters.size;
    }

    const fieldsToReturn = 'name title description thumbnail';
  
    // Fetch products based on the query and pagination
    return await this.productModel
      .find(query)
      .select(fieldsToReturn) // Apply filters
      .skip(skip) // Skip the first (page-1)*perPage products
      .limit(perPage) // Limit the results to 'perPage' products
      .exec(); // Execute the query
  }

  findOneDetail(id: string) {
    return this.productModel.findById(id).exec()
  }

  delete(id: string){
    return this.productModel.findByIdAndDelete(id).exec()
  }
}
