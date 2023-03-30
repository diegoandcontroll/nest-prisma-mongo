import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,

    @Inject(TokenService)
    private tokenService: TokenService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findEmail(email);
    const hashByPass = await bcrypt.compare(pass, user.password);
    if (!hashByPass) {
      throw new UnauthorizedException('Email or password incorrect');
    }
    const payload = { username: user.username, sub: user.id };
    const { password, ...result } = user;
    const token = await this.jwtService.signAsync(payload);
    await this.tokenService.saveToken(token, user.email);
    return {
      user: result,
      access_token: token,
    };
  }

  async login(email: string, id: string) {
    const userFind = await this.usersService.findEmail(email);
    const payload = { username: email, sub: id };
    const token = this.jwtService.sign(payload);
    const { password, ...rest } = userFind;
    await this.tokenService.saveToken(token, email);
    return {
      user: rest,
      access_token: token,
    };
  }
}
