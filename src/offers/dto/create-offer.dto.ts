import { IsNumber, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @Min(1, { message: 'Нельзя добавить меньше 1 руб' })
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
