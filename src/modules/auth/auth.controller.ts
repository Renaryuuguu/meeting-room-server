import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('wechat/login')
  wxLogin() {
    return 'wechat/login';
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
