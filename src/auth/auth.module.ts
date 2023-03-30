import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

import { JwtModule } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => TokenModule),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '180s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
