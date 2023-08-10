import {
  Injectable,
  Global,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { hash } from 'bcrypt';
import { hashRounds } from 'src/utils/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      const { raw } = await this.userRepository.insert(user);
      return raw;
    } catch (e) {
      if (Number(e.code) === 23505) {
        throw new ConflictException(
          'Пользователь с данным именем или email уже существует',
        );
      }
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOneById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(
        `Пользователь с именем ${username} не найден`,
      );
    }
    return user;
  }

  findOneByQuery(query: string): Promise<User[]> {
    console.log(query);
    return this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const password = await hash(updateUserDto.password, hashRounds);
      updateUserDto = { ...updateUserDto, password };
    }
    const updateResult = await this.userRepository.update(id, updateUserDto);
    return updateResult.raw;
  }

  async getUserWishes(username: string): Promise<Wish[]> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: true,
      },
    });
    if (!user) {
      throw new NotFoundException(
        `Пользователь с именем ${username} не найден`,
      );
    }
    return user.wishes;
  }
}
