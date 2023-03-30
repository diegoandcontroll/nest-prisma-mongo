import { MailerService } from '@nestjs-modules/mailer';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { Iforgot, IResetPassword } from './dtos/forgot.dto';
import { PasswordService } from './password.service';

@Controller('account/recovery')
export class PasswordController {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {}
  @Post('forgot')
  async forgot(@Body() data: Iforgot) {
    const token = Math.random().toString(20).substr(2, 12);
    await this.passwordService.create(data.email, token);
    const url = `http://localhost:3000/reset/${token}`;

    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Reset Password',
      html: `Click <a href="${url}">here</a> to forgot password`,
    });
    return {
      message: 'Plis check your email',
    };
  }
  @Put('reset')
  async reset(@Body() data: IResetPassword) {
    if (data.password !== data.confirmPassword) {
      throw new HttpException('PASSWORD NOT MATCH', HttpStatus.BAD_REQUEST);
    }

    const confirmToken = await this.passwordService.findToken(data.token);

    if (!confirmToken) {
      throw new HttpException('INVALID TOKEN', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findEmail(confirmToken.email);

    if (!user) {
      throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    }

    return await this.passwordService.updatePassword(user.id, data.password);
  }
}
