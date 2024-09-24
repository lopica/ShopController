import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let model: Model<Category>;

  beforeEach(async () => {
    const mockCategoryModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category.name), // Mock the Category model
          useValue: mockCategoryModel,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    model = module.get<Model<Category>>(getModelToken(Category.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category', async () => {
    const createCategoryDto: CreateCategoryDto = { name: 'Test Category', status: true };
    const result = { name: 'Test Category', status: true };

    jest.spyOn(model, 'create').mockResolvedValue(result as any);

    expect(await service.create(createCategoryDto)).toBe(result);
    expect(model.create).toHaveBeenCalledWith(createCategoryDto);
  });

  it('should find all categories', async () => {
    const result = [{ id: '1', name: 'Test Category', status: true }];

    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue(result),
    } as any);

    expect(await service.findAll()).toBe(result);
    expect(model.find).toHaveBeenCalled();
  });

  // You would add similar tests for findOne, update, and remove
});
