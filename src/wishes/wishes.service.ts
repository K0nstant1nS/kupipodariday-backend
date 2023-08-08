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
  async create(createWishDto: CreateWishDto): Promise<Wish> {
    const wish = this.wishRepository.create(createWishDto);
    return (await this.wishRepository.insert(wish)).raw;
  }

  findOneById(id: number): Promise<Wish> {
    return this.wishRepository.findOneBy({ id });
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    return (await this.wishRepository.update(id, updateWishDto)).raw;
  }

  async remove(id: number): Promise<Wish> {
    return (await this.wishRepository.delete({ id })).raw;
  }

  /*async postCopy(id: number) {
    const original = await this.wishRepository.findOneBy({ id });
    const {id, ...copy}
  }*/
}
