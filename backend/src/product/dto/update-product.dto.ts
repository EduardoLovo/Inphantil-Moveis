import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// O PartialType faz com que todos os campos do CreateProductDto sejam opcionais.
export class UpdateProductDto extends PartialType(CreateProductDto) {}
