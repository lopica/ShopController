import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Color, ColorDocument } from './entities/color.entity';
import { Model } from 'mongoose';

@Injectable()
export class ColorService {
  constructor(@InjectModel(Color.name) private colorModel: Model<ColorDocument>) {}

  async create(createColorDto: CreateColorDto): Promise<ColorDocument> {
    const createdColor = new this.colorModel(createColorDto);
    return createdColor.save();
  }

  async findAll(): Promise<ColorDocument[]> {
    return this.colorModel.find().exec();
  }

  async findOne(id: string): Promise<ColorDocument> {
    const color = await this.colorModel.findById(id).exec();
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found.`);
    }
    return color;
  }

  async update(
    id: string,
    updateColorDto: UpdateColorDto,
  ): Promise<ColorDocument> {
    const updatedColor = await this.colorModel
      .findByIdAndUpdate(id, updateColorDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedColor) {
      throw new NotFoundException(`Color with ID ${id} not found.`);
    }
    return updatedColor;
  }

  async remove(id: string): Promise<ColorDocument> {
    const result = await this.colorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Color with ID ${id} not found.`);
    }
    return result;
  }
}
