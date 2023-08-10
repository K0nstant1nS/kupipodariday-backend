import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
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

    await this.wishesService.update(itemId, {
      raised: wish.raised + createOfferDto.amount,
    });
    const updatedWish = await this.wishesService.findOneById(itemId);
    const { raw } = await this.offerRepository.insert({
      ...offerData,
      user,
      item: updatedWish,
    });
    return raw;
  }

  findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOneBy({ id });
  }
}
