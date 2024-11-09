import { PartialType } from '@nestjs/swagger';
import { CreateDepotProductDto } from './create-depot-product.dto';

export class UpdateDepotProductDto extends PartialType(CreateDepotProductDto) {}
