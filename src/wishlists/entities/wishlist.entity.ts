import { Column, JoinColumn, ManyToOne, ManyToMany, Entity } from 'typeorm';
import { Length, MaxLength, IsUrl, IsString } from 'class-validator';
import { DefaultEntity } from 'src/defalut-entity.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity('wishlists')
export class Wishlist extends DefaultEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsString()
  @MaxLength(250)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @JoinColumn()
  @ManyToMany(() => Wish)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
