import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { TransformInterceptor } from 'src/utils/transfrom-interceptor';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(TransformInterceptor)
  @Get('me')
  getMe(@Req() req) {
    const { id } = req.user;
    return this.usersService.findOneById(id);
  }

  @Get('me/wishes')
  getWishes(@Req() req) {
    const { username } = req.user;
    return this.usersService.getUserWishes(username);
  }

  @UseInterceptors(TransformInterceptor)
  @Get(':username')
  async getUserByName(@Param('username') username) {
    return this.usersService.findOneByUsername(username);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username) {
    return this.usersService.getUserWishes(username);
  }

  @UseInterceptors(TransformInterceptor)
  @Post('find')
  findUser(@Body() body) {
    return this.usersService.findOneByQuery(body.query);
  }

  @UseInterceptors(TransformInterceptor)
  @Patch('me')
  patchUser(@Req() req, @Body() body: UpdateUserDto) {
    const { id } = req.user;
    return this.usersService.update(id, body);
  }
}
