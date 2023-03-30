import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hash;
    const user = await this.prisma.user.create({
      data: createUserDto,
      select: {
        password: false,
        email: true,
        image: true,
        username: true,
        id: true,
      },
    });

    return user;
  }

  async addAvatar(id: string, urlImage: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: {
        password: false,
        email: true,
        image: true,
        username: true,
        id: true,
      },
    });
    if (!user) {
      throw new HttpException('NOT FOUND USER', HttpStatus.NOT_FOUND);
    }

    if (user.image === null || user.image === '') {
      await this.prisma.user.update({
        where: { id },
        data: {
          image: urlImage,
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id },
        data: {
          image: urlImage,
        },
      });
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        password: false,
        email: true,
        image: true,
        username: true,
        id: true,
      },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: {
        password: false,
        email: true,
        image: true,
        username: true,
        id: true,
      },
    });
    if (!user) {
      throw new HttpException('NOT FOUND USER', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
      select: {
        email: true,
        id: true,
        password: true,
        username: true,
        image: true,
      },
    });
    if (!user) {
      throw new HttpException('NOT FOUND USER', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new HttpException('NOT FOUND USER', HttpStatus.NOT_FOUND);
    }

    const userUpdate = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        password: false,
        email: true,
        image: true,
        username: true,
        id: true,
      },
    });

    return userUpdate;
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id },
      select: {
        password: false,
        email: true,
        image: true,
        username: true,
        id: true,
      },
    });
  }
}
