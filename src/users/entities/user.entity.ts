import { Entity, Column, JoinColumn, OneToMany } from 'typeorm';
import { Length, IsUrl, IsEmail, IsString } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { DefaultEntity } from '../../defalut-entity.entity';

@Entity('users')
export class User extends DefaultEntity {
  @Column({ unique: true })
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @JoinColumn()
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @JoinColumn()
  @OneToMany(() => Offer, (offer) => offer.id)
  offers: Offer[];

  @JoinColumn()
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
