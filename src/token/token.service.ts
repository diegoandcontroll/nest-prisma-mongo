import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokenService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(UsersService)
    private readonly userService: UsersService,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}
  async saveToken(hash: string, email: string) {
    const objToken = await this.prisma.token.findFirst({
      where: { email },
    });
    if (!objToken) {
      const token = await this.prisma.token.create({
        data: {
          email,
          hash,
        },
      });
      return token;
    } else {
      await this.prisma.token.update({
        where: { id: objToken.id },
        data: {
          hash,
          email,
        },
      });
    }
  }
  async refreshToken(oldToken: string) {
    const objToken = await this.prisma.token.findFirst({
      where: { hash: oldToken },
    });
    if (!objToken) {
      throw new HttpException(
        {
          errorMessage: 'INVALID_TOKEN',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const user = await this.userService.findEmail(objToken.email);
    return this.authService.login(user);
  }
}
