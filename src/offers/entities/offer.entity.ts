import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { IsNumber, IsBoolean } from 'class-validator';
import { DefaultEntity } from 'src/defalut-entity.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

export class Offer extends DefaultEntity {
  @JoinColumn()
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ scale: 2 })
  @IsNumber()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
