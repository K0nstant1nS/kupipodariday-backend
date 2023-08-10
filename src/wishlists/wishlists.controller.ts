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
  ForbiddenException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOneById(+id);
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const { owner } = await this.wishlistsService.findOneById(+id);
    if (owner.id !== req.user.id) {
      throw new ForbiddenException(
        'Нет прав для изменения данного списка желаемого',
      );
    }
    return this.wishlistsService.update(+id, updateWishlistDto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const { owner } = await this.wishlistsService.findOneById(+id);
    if (owner.id !== req.user.id) {
      throw new ForbiddenException(
        'Нет прав для удаления данного списка желаемого',
      );
    }
    return this.wishlistsService.remove(+id);
  }
}
