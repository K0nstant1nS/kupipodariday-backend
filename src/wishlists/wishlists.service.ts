import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistService: Repository<Wishlist>,
  ) {}
  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const wishlist = this.wishlistService.create(createWishlistDto);
    const { raw } = await this.wishlistService.insert(wishlist);
    return raw;
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistService.find();
  }

  findOneById(id: number): Promise<Wishlist> {
    return this.wishlistService.findOneBy({ id });
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
