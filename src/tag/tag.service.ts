import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './entities/tag.entity';
import { Model } from 'mongoose';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(createTagDto: CreateTagDto): Promise<TagDocument> {
    const createdTag = new this.tagModel(createTagDto);
    return createdTag.save();
  }

  async findAll(): Promise<TagDocument[]> {
    return this.tagModel.find().exec();
  }

  async findOne(id: string): Promise<TagDocument> {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found.`);
    }
    return tag;
  }

  async update(
    id: string,
    updateTagDto: UpdateTagDto,
  ): Promise<TagDocument> {
    const updatedTag = await this.tagModel
      .findByIdAndUpdate(id, updateTagDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedTag) {
      throw new NotFoundException(`Tag with ID ${id} not found.`);
    }
    return updatedTag;
  }

  async remove(id: string): Promise<TagDocument> {
    const result = await this.tagModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Tag with ID ${id} not found.`);
    }
    console.log(result)
    return result;
  }
}
