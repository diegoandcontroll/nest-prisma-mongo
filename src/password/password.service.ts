import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
@Injectable()
export class PasswordService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async create(email: string, token: string) {
    const passwordForgot = await this.prisma.password.create({
      data: {
        email,
        token,
      },
    });

    return passwordForgot;
  }

  async findToken(token: string) {
    const tokenValid = await this.prisma.password.findFirst({
      where: { token },
    });
    if (!token) {
      throw new HttpException('TOKEN NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return tokenValid;
  }

  async updatePassword(id: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    const userUpdatePassword = await this.prisma.user.update({
      where: { id },
      data: {
        password: passwordHash,
      },
    });
    return { message: 'PASSWORD UPDATED' };
  }
}
