import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Type, TypeDocument } from './entities/type.entity';
import { Model } from 'mongoose';

@Injectable()
export class TypeService {
  constructor(@InjectModel(Type.name) private typeModel: Model<TypeDocument>) {}

  async create(createTypeDto: CreateTypeDto): Promise<TypeDocument> {
    const createdType = new this.typeModel(createTypeDto);
    return createdType.save();
  }

  async findAll(): Promise<TypeDocument[]> {
    return this.typeModel.find().exec();
  }

  async findOne(id: string): Promise<TypeDocument> {
    const type = await this.typeModel.findById(id).exec();
    if (!type) {
      throw new NotFoundException(`Type with ID ${id} not found.`);
    }
    return type;
  }

  async update(
    id: string,
    updateTypeDto: UpdateTypeDto,
  ): Promise<TypeDocument> {
    const updatedType = await this.typeModel
      .findByIdAndUpdate(id, updateTypeDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedType) {
      throw new NotFoundException(`Type with ID ${id} not found.`);
    }
    return updatedType;
  }

  async remove(id: string): Promise<TypeDocument> {
    const result = await this.typeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Type with ID ${id} not found.`);
    }
    return result;
  }
}
