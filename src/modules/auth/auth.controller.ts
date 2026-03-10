import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('wx-login')
  async wxLogin(@Body() code: string) {
    return this.authService.wxLogin(code);
  }

  @Post('bind-employee')
  bindEmployee() {
    return 'bind-employee';
  }

  @Get('profile')
  profile() {
    return 'profile';
  }
}
