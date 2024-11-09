import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { Model, Types } from 'mongoose';
import { CategoryService } from 'src/category/category.service';
import { BrandService } from 'src/brand/brand.service';
import { TagService } from 'src/tag/tag.service';
import { TypeService } from 'src/type/type.service';
import { randomBytes } from 'crypto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly tagService: TagService,
    private readonly typeService: TypeService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const categoryExists = await this.categoryService.findOne(
      createProductDto.category,
    );
    if (!categoryExists) {
      throw new NotFoundException('Category Id not found');
    }
    try {
      const createdProduct = new this.productModel(createProductDto);
      return await createdProduct.save();

    } catch (error) {
      console.log(error);
    }
  }

  async findAll(brand?: string, category?: string): Promise<ProductDocument[]> {
    const filter: any = {};
    
    if (brand) {
      filter.brand = brand;
    }
    if (category) {
      filter.category = category;
    }
  
    return this.productModel.find(filter).exec();
  }
  

  async findAllList(productIds: string[]) {
    return this.productModel.find({ _id: { $in: productIds } })
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return product;
  }

  async findByCategoryId(categoryId: string): Promise<ProductDocument[]> {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestException('Invalid category ID');
    }

    const categoryExists = await this.categoryService.findOne(categoryId);
    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }

    const products = await this.productModel
      .find({ category: categoryId })
      .populate('category', 'name');

    if (products.length === 0) {
      throw new NotFoundException('Products not found');
    }

    return products;
  }

  async updatePrice(id: string, newPrice: number): Promise<ProductDocument> {
    // Find the product by ID
    const productFound = await this.productModel.findById(id);

    // If the product is not found, throw an error
    if (!productFound) {
      throw new NotFoundException('Product not found');
    }

    // Update the price if newPrice is not undefined or null
    if (newPrice !== undefined && newPrice !== null) {
      //line 227 : check xem cái input người dùng có phải là số || null không, ko thì mới update
      productFound.price = newPrice ? newPrice : productFound.price;
    }

    const updatedProduct = await productFound.save();
    return updatedProduct;
  }

  async updateStatus(id: string, status: string): Promise<ProductDocument> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { availabilityStatus: status },
      { new: true },
    );
    // console.log(product);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(id: string): Promise<ProductDocument> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    console.log(result);
    return result;
  }

  async importProducts(products) {
    try {
      const importedProducts = [];
      for (const productData of products) {
        const {
          title,
          description,
          category,
          price,
          discountPercentage,
          stock,
          type,
          availabilityStatus,
          minimumOrderQuantity,
          images,
          thumbnail,
          tag,
          brand,
          stockDetails,
        } = productData;
  
        // console.log(productData);
  
        const categoryObject: any = await this.categoryService.findOneByName(category);
        const tagObject: any = await this.tagService.findOneByName(tag);
        const brandObject: any = await this.brandService.findOneByName(brand);
        const typeObject: any = await this.typeService.findOneByName(type);
  
        // console.log(categoryObject);
        // console.log(tagObject);
        // console.log(brandObject);
        // console.log(typeObject);
  
        // Check if any required field is missing
        if (!categoryObject || !tagObject || !brandObject || !typeObject) {
          break;
        }
  
        // Generate a unique public_id for Cloudinary uploads
        const public_id = "hlw" + randomBytes(8).toString("hex");
  
        // Upload the thumbnail to Cloudinary
        const thumbnailUrl = await this.cloudinaryService.uploadToCloudinaryByUrl(thumbnail, public_id + "_thumbnail");
  
        // Upload images to Cloudinary and get their URLs
        const imagesUrl = await Promise.all(
          images.map((image, index) =>
            this.cloudinaryService.uploadToCloudinaryByUrl(image, public_id + "_image" + (index + 1))
          )
        );
  
        const newProduct = new this.productModel({
          title,
          description,
          category: categoryObject._id,
          price: price || 0,
          discountPercentage: discountPercentage || 0,
          rating: 0,
          stock: stock || 0,
          type: typeObject._id,
          tag: tagObject._id,
          brand: brandObject._id,
          availabilityStatus: availabilityStatus || "InActive",
          minimumOrderQuantity: minimumOrderQuantity || 1,
          images: imagesUrl,
          thumbnail: thumbnailUrl,
          reviews: [],
          stockDetails: stockDetails || [],
        });
  
        const savedProduct = await newProduct.save();
        importedProducts.push(savedProduct);
      }
  
      return { message: "Products imported successfully", products: importedProducts };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  
}
