import { IsNumber, IsString, IsUrl, Length, Min } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250, {
    message: 'Название подарка должно содержать от 1 до 250 символов',
  })
  name: string;

  @IsUrl({}, { message: 'Ссылка должна быть в формате URL' })
  link: string;

  @IsUrl({}, { message: 'Изображение должно быть в формате URL' })
  image: string;

  @IsNumber()
  @Min(1, { message: 'Цена не может быть меньше 1' })
  price: number;

  @IsString()
  description: string;
}
