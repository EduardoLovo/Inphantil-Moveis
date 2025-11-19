import { PartialType } from '@nestjs/swagger';
import { CreateVisualItemDto } from './create-visual-item.dto';

export class UpdateVisualItemDto extends PartialType(CreateVisualItemDto) {}
