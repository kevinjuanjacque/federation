import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

export interface LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }


  @UseGuards(AuthGuard)
  @Get()
  test() {
    return 'OK';
  }
}
