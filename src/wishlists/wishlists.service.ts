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
  create(createWishlistDto: CreateWishlistDto) {
    const wishlist = this.wishlistService.create(createWishlistDto);
    return this.wishlistService.insert(wishlist);
  }

  findAll() {
    return this.wishlistService.find();
  }

  findOneById(id: number) {
    return this.wishlistService.findOneBy({ id });
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistService.update(id, updateWishlistDto);
  }

  remove(id: number) {
    return this.wishlistService.delete({ id });
  }
}
