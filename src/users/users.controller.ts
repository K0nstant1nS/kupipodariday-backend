import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get(':username')
  getUserByName(@Param('username') username) {
    return this.usersService.findOneByUsername(username);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username) {
    return this.usersService.getUserWishes(username);
  }

  @Post('find')
  findUser(@Body() body) {
    return this.usersService.findOneByQuery(body.query);
  }

  @Patch('me')
  patchUser(@Req() req, @Body() body: UpdateUserDto) {
    const { id } = req.user;
    console.log(body);
    return this.usersService.update(id, body);
  }
}
