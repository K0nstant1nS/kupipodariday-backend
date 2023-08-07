import {
  Column,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Length, IsUrl, IsInt, IsString, IsNumber } from 'class-validator';
import { DefaultEntity } from 'src/defalut-entity.entity';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

export class Wish extends DefaultEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ scale: 2 })
  @IsNumber()
  price: number;

  @Column({ scale: 2 })
  @IsNumber()
  raised: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @JoinColumn()
  @OneToMany(() => Offer, (offer) => offer.item) // добавить поле для записи
  offers: Offer[];

  @Column()
  @IsInt()
  copied: number;
}
