import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Length(2, 30, { message: 'Имя должно содержать от 2 до 30 символов' })
  username: string;

  @IsOptional()
  @IsString()
  @Length(2, 200, {
    message: `Поле 'О себе' должно содержать от 2 до 200 символов`,
  })
  about: string;

  @IsOptional()
  @IsUrl({}, { message: 'Проверьте корректность ссылки на аватар' })
  avatar: string;

  @IsEmail({}, { message: 'Использован некорректный email' })
  email: string;

  @IsString()
  @MinLength(2)
  password: string;
}
