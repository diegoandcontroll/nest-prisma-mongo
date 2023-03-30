import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FirebaseService } from 'src/utils/firebase.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, FirebaseService],
  exports: [UsersService],
})
export class UsersModule {}
