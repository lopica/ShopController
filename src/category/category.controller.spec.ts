import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const mockCategoryService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService, // Mocking the service
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create when creating a category', async () => {
    const createCategoryDto: CreateCategoryDto = { name: 'Test Category', status: true };
    const result = { id: '1', name: 'Test Category', status: true };

    jest.spyOn(service, 'create').mockResolvedValue(result as any);

    expect(await controller.create(createCategoryDto)).toBe(result);
    expect(service.create).toHaveBeenCalledWith(createCategoryDto);
  });

  it('should call service.findAll when finding all categories', async () => {
    const result = [{ id: '1', name: 'Test Category', status: true }];

    jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

    expect(await controller.findAll()).toBe(result);
    expect(service.findAll).toHaveBeenCalled();
  });

  // You would add similar tests for findOne, update, and remove
});
