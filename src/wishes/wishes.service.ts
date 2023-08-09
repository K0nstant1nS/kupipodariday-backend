import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}
  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    const wish = this.wishRepository.create({ ...createWishDto, owner: user });
    return (await this.wishRepository.insert(wish)).raw;
  }

  async getLastWishes(amount: number): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: amount,
    });
  }

  async getTopWishes(amount: number): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: amount,
    });
  }

  findOneById(id: number): Promise<Wish> {
    return this.wishRepository.findOne({
      where: { id },
      relations: {
        offers: true,
        owner: true,
      },
    });
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    return (await this.wishRepository.update(id, updateWishDto)).raw;
  }

  async remove(id: number): Promise<Wish> {
    return (await this.wishRepository.delete({ id })).raw;
  }

  async postCopy(id: number, user: User) {
    const original = await this.wishRepository.findOneBy({ id });
    await this.wishRepository.update(id, {
      ...original,
      copied: original.copied + 1,
    });
    const { id: oldId, owner, offers, ...copy } = original;
    const copiedWish = await this.wishRepository.create({
      ...copy,
      owner: user,
    });
    return copiedWish;
  }
}
