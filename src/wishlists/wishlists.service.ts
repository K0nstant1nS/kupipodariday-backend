import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistService: Repository<Wishlist>,
  ) {}
  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const { itemsId, ...createWishData } = createWishlistDto;
    const items = itemsId.map((id) => {
      return { id } as unknown as Wish;
    });
    const wishlist = this.wishlistService.create({
      ...createWishData,
      items,
      owner: user,
    });
    return await this.wishlistService.save(wishlist);
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistService.find();
  }

  async findOneById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistService.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    if (!wishlist) {
      throw new NotFoundException('Список желаемого не найден');
    }
    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const { raw } = await this.wishlistService.update(id, updateWishlistDto);
    return raw;
  }

  async remove(id: number): Promise<Wishlist> {
    const { raw } = await this.wishlistService.delete({ id });
    return raw;
  }
}
