import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { WishesModule } from './wishes/wishes.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Offer } from './offers/entities/offer.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './utils/config';

const rootConfig = config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: rootConfig.dbHost,
      port: rootConfig.dbPort,
      username: rootConfig.dbUsername,
      password: rootConfig.dbPassword,
      database: rootConfig.dbName,
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
