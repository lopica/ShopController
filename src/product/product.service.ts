import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { Model, Types } from 'mongoose';
import {
  Category,
  CategoryDocument,
} from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const categoryExists = await this.categoryModel.findById(
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

  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find().exec();
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

    const categoryExists = await this.categoryModel.findById(categoryId);
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

  // async importProducts(products: Product): Promise<ProductDocument> {
  //   try {
  //     const importedProducts = [];

  //     for (let productData of products) {
  //       const { title, description, category, price, discountPercentage, stock, type, availabilityStatus, minimumOrderQuantity, images, thumbnail, tag, brand, stockDetails } = productData;

  //       const categoryObject = await Category.findOne({ name: category });
  //       const tagObject = await Tag.findOne({ name: tag });
  //       const brandObject = await Brand.findOne({ name: brand });
  //       const typeObject = await Type.findOne({ name: type });

  //       // Generate a unique public_id for Cloudinary uploads
  //       const public_id = "hlw" + crypto.randomBytes(8).toString("hex");

  //       // Upload the thumbnail to Cloudinary
  //       const thumbnailUrl = await uploadToCloudinary(thumbnail, public_id + "_thumbnail");

  //       // Upload images to Cloudinary and get their URLs
  //       const imagesUrl = await Promise.all(images.map((image, index) => uploadToCloudinary(image, public_id + "_image" + (index + 1))));

  //       const newProduct = new Product({
  //         title,
  //         description,
  //         category: categoryObject ? categoryObject._id : null,
  //         price: price || 0,
  //         discountPercentage: discountPercentage || 0,
  //         rating: 0,
  //         stock: stock || 0,
  //         type: typeObject ? typeObject._id : null,
  //         tag: tagObject ? tagObject._id : null,
  //         brand: brandObject ? brandObject._id : null,
  //         availabilityStatus: availabilityStatus || "InActive",
  //         minimumOrderQuantity: minimumOrderQuantity || 1,
  //         images: imagesUrl,
  //         thumbnail: thumbnailUrl,
  //         reviews: [],
  //         stockDetails: stockDetails || [],
  //       });

  //       const savedProduct = await newProduct.save();
  //       importedProducts.push(savedProduct);
  //     }

  //     res.status(201).json({ message: "Products imported successfully", products: importedProducts });
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // };
}
