import { forwardRef, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from './token/token.module';

import { PrismaModule } from './prisma/prisma.module';
import { PasswordModule } from './password/password.module';
import { PostModule } from './post/post.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    TokenModule,
    PasswordModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
