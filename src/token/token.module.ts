import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { TokenService } from './token.service';

@Module({
  imports: [PrismaModule, UsersModule, forwardRef(() => AuthModule)],
  providers: [TokenService, TokenService],
  exports: [TokenService],
})
export class TokenModule {}
