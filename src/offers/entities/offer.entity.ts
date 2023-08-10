import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNumber, IsBoolean } from 'class-validator';
import { DefaultEntity } from 'src/defalut-entity.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity('offers')
export class Offer extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ scale: 2 })
  @IsNumber({})
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
