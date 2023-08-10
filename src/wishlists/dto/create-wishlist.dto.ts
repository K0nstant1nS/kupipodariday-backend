import { IsString, IsUrl, IsNumber } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  name: string;

  @IsUrl(
    {},
    {
      message: 'Передена невалидная ссылка на изображение',
    },
  )
  image: string;

  @IsNumber({}, { each: true })
  itemsId: number[];
}
