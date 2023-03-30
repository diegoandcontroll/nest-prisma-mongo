import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PrismaModule,
    MailerModule.forRoot({
      transport: {
        host: '0.0.0.0',
        port: 1025,
      },
      defaults: {
        from: 'admin@example.com',
      },
    }),
    UsersModule,
  ],
  providers: [PasswordService],
  exports: [PasswordService],
  controllers: [PasswordController],
})
export class PasswordModule {}
