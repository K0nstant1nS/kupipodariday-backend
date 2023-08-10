import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  UseInterceptors,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { hashPassword } from 'src/utils/hash';
import { hashRounds } from 'src/utils/constants';
import { TransformInterceptor } from 'src/utils/transfrom-interceptor';

@Controller('/')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  /**
   * Стратегия local автоматически достанет username и password из тела запроса
   * Если пароль будет верным, данные пользователя окажутся в объекте req.user
   */
  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req) {
    /* Генерируем для пользователя JWT-токен */
    return this.authService.auth(req.user);
  }

  @UseInterceptors(TransformInterceptor)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const password = await hashPassword(createUserDto.password, hashRounds);
    const user = await this.usersService.create({ ...createUserDto, password });

    return this.authService.auth(user);
  }
}
