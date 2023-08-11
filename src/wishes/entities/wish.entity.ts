import { Column, JoinColumn, ManyToOne, OneToMany, Entity } from 'typeorm';
import {
  Length,
  IsUrl,
  IsInt,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { DefaultEntity } from 'src/utils/defalut-entity.entity';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity('wishes')
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

  @Column({ scale: 2, default: 0 })
  @IsOptional()
  raised: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @JoinColumn()
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsInt()
  copied: number;
}
