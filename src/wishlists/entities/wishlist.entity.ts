import {
  Column,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  Entity,
  JoinTable,
} from 'typeorm';
import {
  Length,
  MaxLength,
  IsUrl,
  IsString,
  IsOptional,
} from 'class-validator';
import { DefaultEntity } from 'src/defalut-entity.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity('wishlists')
export class Wishlist extends DefaultEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @IsString()
  @MaxLength(250)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @JoinTable()
  @ManyToMany(() => Wish)
  @IsOptional()
  items: Wish[];

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
