import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDto } from './create-wish.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Сумма пожертвования не может быть меньше 1' })
  raised?: number;
}
