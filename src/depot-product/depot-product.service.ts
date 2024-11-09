import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepotProductDto } from './dto/create-depot-product.dto';
import { UpdateDepotProductDto } from './dto/update-depot-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DepotProduct,
  DepotProductDocument,
} from './entities/depot-product.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class DepotProductService {
  constructor(
    @InjectModel(DepotProduct.name)
    private depotProductModel: Model<DepotProductDocument>,
    private readonly productService: ProductService,
  ) {}

  async create(createDepotProductDto: CreateDepotProductDto) {
    try {
      const { productId, importPrice, stock, stockDetails, importTotal } =
        createDepotProductDto;

      // Transform stockDetails to match the required schema
      const transformedStockDetails = stockDetails.map((detail) => ({
        // imageLink: detail.imageLink,
        colorCode: detail.colorCode,
        details: Object.keys(detail.details).map((size) => ({
          size,
          quantity: detail.details[size],
        })),
      }));

      // Create a new ProductDepot instance
      const newProductDepot = new this.depotProductModel({
        productId,
        importPrice,
        stock,
        stockDetails: transformedStockDetails,
        importTotal,
      });

      // Save the new ProductDepot instance to the database
      await newProductDepot.save();

      // Update the stock and stock details in the Product model
      const product = await this.productService.findOne(productId.toString());
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Update the stock in the Product model
      product.stock += stock;

      // Update the stock details in the Product model
      transformedStockDetails.forEach((detail) => {
        const existingDetail = product.stockDetails.find(
          (d) => d.colorCode === detail.colorCode,
        );
        if (existingDetail) {
          detail.details.forEach((sizeDetail) => {
            const existingSizeDetail = existingDetail.details.find(
              (sd) => sd.size === sizeDetail.size,
            );
            if (existingSizeDetail) {
              existingSizeDetail.quantity += sizeDetail.quantity;
            } else {
              existingDetail.details.push(sizeDetail);
            }
          });
        } else {
          product.stockDetails.push(detail);
        }
      });

      // Save the updated product
      await product.save();
      console.log(product);
      return {
        message: 'Product depot created and product stock updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(pageQuery: string, limitQuery: string) {
    const page = parseInt(pageQuery) || 1;
    const limit = parseInt(limitQuery) || 10;

    try {
      const query = {};
      const skip = (page - 1) * limit;
      const productDepots = await this.depotProductModel
        .find(query)
        .populate('_id')
        .skip(skip)
        .limit(limit);
      // const productFound = await ProductDepot.find(query).populate("productId");
      // console.log(productFound);

      const totalProductDepots =
        await this.depotProductModel.countDocuments(query);
      const totalPages = Math.ceil(totalProductDepots / limit);

      return {
        productDepots,
        currentPage: page,
        totalPages,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    const productDepot = await this.depotProductModel
      .findById(id)
      .populate('productId');
    try {
      if (!productDepot) {
        throw new NotFoundException('ProductDepot not found');
      }
      return productDepot;
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  async update(id: string, updateDepotProductDto: UpdateDepotProductDto) {
    try {
      const updatedProductDepot =
        await this.depotProductModel.findByIdAndUpdate(
          id,
          updateDepotProductDto,
          { new: true },
        );
      if (!updatedProductDepot) {
        throw new NotFoundException('ProductDepot not found');
      }
      return updatedProductDepot;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const deletedProductDepot =
        await this.depotProductModel.findByIdAndDelete(id);
      if (!deletedProductDepot) {
        throw new NotFoundException('ProductDepot not found');
      }
      return 'ProductDepot deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
