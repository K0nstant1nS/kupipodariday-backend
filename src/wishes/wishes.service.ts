import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}
  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    const wish = this.wishRepository.create({ ...createWishDto, owner: user });
    return await this.wishRepository.save(wish);
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

  async findOneById(id: number): Promise<Wish> {
    const wish = this.wishRepository.findOne({
      where: { id },
      relations: {
        offers: true,
        owner: true,
      },
    });
    if (!wish) {
      throw new NotFoundException('Желаемое не найдено');
    }
    return wish;
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    const wish = await this.wishRepository.findOneBy({ id });
    if (wish.offers.length > 0) {
      throw new BadRequestException(
        'Нельзя изменить желание, поддержанное другими пользователями',
      );
    }
    return (await this.wishRepository.update(id, updateWishDto)).raw;
  }

  async remove(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOneBy({ id });
    if (wish.offers.length > 0) {
      throw new BadRequestException(
        'Нельзя изменить желание, поддержанное другими пользователями',
      );
    }
    return (await this.wishRepository.delete({ id })).raw;
  }

  async postCopy(id: number, user: User): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();
    const original = await this.wishRepository.findOneBy({ id });
    const { name, link, image, price, description } = original;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      queryRunner.manager.update(Wish, id, {
        ...original,
        copied: original.copied + 1,
      });
      const copiedWish = queryRunner.manager.create(Wish, {
        name,
        link,
        image,
        price,
        description,
        owner: user,
      });
      await queryRunner.manager.save(copiedWish);
      await queryRunner.commitTransaction();
      return copiedWish;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Произошла ошибка при попытка схранения',
      );
    } finally {
      await queryRunner.release();
    }
    /* const original = await this.wishRepository.findOneBy({ id });  // Пока оставил данный коммент, если
    await this.wishRepository.update(id, {                            // queryRunner - излишння функциональность
      ...original,                                                    // Снесу его и раскомменчу данное решение
      copied: original.copied + 1,
    });
    const { name, link, image, price, description } = original;
    const copiedWish = await this.wishRepository.create({
      name,
      link,
      image,
      price,
      description,
      owner: user,
    });
    const insertedWish = this.wishRepository.save(copiedWish);
    return insertedWish; */
  }
}
