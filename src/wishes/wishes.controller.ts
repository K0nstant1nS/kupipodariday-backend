import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  getLast() {
    return this.wishesService.getLastWishes(40);
  }

  @Get('top')
  getTop() {
    return this.wishesService.getTopWishes(20); // В задании написано про 20 подарков, в чеклисте про 10
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOneById(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const { owner } = await this.wishesService.findOneById(+id);
    if (owner.id !== req.user.id) {
      throw new ForbiddenException('Нет прав для изменения данной карточки');
    }
    if (updateWishDto.raised) {
      throw new BadRequestException(`Нельзя изменять кол-во собранных средств`);
    }
    return this.wishesService.update(+id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const { owner } = await this.wishesService.findOneById(+id);
    if (owner.id !== req.user.id) {
      throw new ForbiddenException('Нет прав для удаления данной карточки');
    }
    return this.wishesService.remove(+id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  postCopy(@Req() req, @Param('id') id) {
    return this.wishesService.postCopy(+id, req.user);
  }
}
