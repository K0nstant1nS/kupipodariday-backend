import { UnauthorizedException } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

export const hashPassword = (
  password: string,
  saltOrRounds: string | number,
) => {
  return hash(password, saltOrRounds);
};

export const comparePassword = async (password: string, user: User | null) => {
  const match = await compare(password, user.password);
  if (user && match) {
    const { password, ...result } = user;

    return result;
  }

  throw new UnauthorizedException('Введен неправильный пароль');
};
