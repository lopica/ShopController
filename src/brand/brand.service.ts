import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from './entities/brand.entity';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<BrandDocument>) {}

  async create(createBrandDto: CreateBrandDto): Promise<BrandDocument> {
    const createdBrand = new this.brandModel(createBrandDto);
    return createdBrand.save();
  }

  async findAll(): Promise<BrandDocument[]> {
    return this.brandModel.find().exec();
  }

  async findOne(id: string): Promise<BrandDocument> {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found.`);
    }
    return brand;
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandDocument> {
    const updatedBrand = await this.brandModel
      .findByIdAndUpdate(id, updateBrandDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedBrand) {
      throw new NotFoundException(`Brand with ID ${id} not found.`);
    }
    return updatedBrand;
  }

  async remove(id: string): Promise<BrandDocument> {
    const result = await this.brandModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Brand with ID ${id} not found.`);
    }
    return result;
  }
}
