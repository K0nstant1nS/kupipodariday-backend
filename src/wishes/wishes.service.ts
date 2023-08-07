import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}
  create(createWishDto: CreateWishDto) {
    const wish = this.wishRepository.create(createWishDto);
    return this.wishRepository.insert(wish);
  }

  findOneById(id: number) {
    return this.wishRepository.findOneBy({ id });
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return this.wishRepository.update(id, updateWishDto);
  }

  remove(id: number) {
    return this.wishRepository.delete({ id });
  }

  /*async postCopy(id: number) {
    const original = await this.wishRepository.findOneBy({ id });
    const {id, ...copy}
  }*/
}
