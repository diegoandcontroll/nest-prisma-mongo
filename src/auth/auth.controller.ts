import {
  Body,
  Controller,
  forwardRef,
  Inject,
  Post,
  Put,
} from '@nestjs/common';
import { AuthDto } from 'src/Interfaces/auth-dto';
import { TokenService } from 'src/token/token.service';
import { AuthService } from './auth.service';
interface RefreshTokenDto {
  oldToken: string;
}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    @Inject(forwardRef(() => TokenService))
    private tokenService: TokenService,
  ) {}
  @Post('login')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto.email, authDto.password);
  }
  @Put('refresh')
  async refreshToken(@Body() data: RefreshTokenDto) {
    console.log(data);
    return await this.tokenService.refreshToken(data.oldToken);
  }
}
