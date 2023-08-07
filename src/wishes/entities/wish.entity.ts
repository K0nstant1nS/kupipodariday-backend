import {
  Column,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Length, IsUrl, IsInt } from 'class-validator';
import { DefaultEntity } from 'src/defalut-entity.entity';
import { configureDigitsAfterDot } from 'src/utils/funcs';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

export class Wish extends DefaultEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column() // Добавить округление до 2 знаков после запятой
  price: number;

  @Column()
  raised: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @JoinColumn()
  @OneToMany(() => Offer, (offer) => offer) // добавить поле для записи
  offers: Offer[];

  @Column()
  @IsInt()
  copied: number;

  @BeforeInsert()
  configureNumber() {
    if (this.price) {
      this.price = configureDigitsAfterDot(this.price, 2);
    }
    if (this.raised) {
      this.raised = configureDigitsAfterDot(this.raised, 2);
    }
  }
}
