import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './auth.controller';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService){}
    private user = 'admin';
  private password = 'admin';

    async login(login: LoginDto){
        if (login.email === this.user && login.password === this.password) {
            return {
              message: 'OK',
              token: await this.jwtService.signAsync(login)
            };
          } else {
            throw new UnauthorizedException();
          }
    }
}
