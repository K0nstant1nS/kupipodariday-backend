import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}
  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const { itemId, ...offerData } = createOfferDto;
    const wish = await this.wishesService.findOneById(itemId);

    if (wish.owner.id === user.id) {
      throw new ConflictException('Нельзя отправлять деньги на свое желание');
    }
    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new BadRequestException(
        `Сбор не может превышать стоимость подарка. Максимальная доступная для внесения сумма -  ${
          wish.price - wish.raised
        } руб`,
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Wish, itemId, {
        raised: wish.raised + createOfferDto.amount,
      });
      const updatedWish = await queryRunner.manager.findOneBy(Wish, {
        id: itemId,
      });
      const savedOffer = await queryRunner.manager.save(Offer, {
        ...offerData,
        user,
        item: updatedWish,
      });
      await queryRunner.commitTransaction();
      return savedOffer;
    } catch (e) {
      throw new InternalServerErrorException('Ошибка при проведении операции');
    } finally {
      await queryRunner.release();
    }
  }

  findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOneBy({ id });
  }
}
