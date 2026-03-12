import { Body, Controller, Get, Post } from '@nestjs/common';

import { BindEmployeeDto } from './dto/bindEmployee.dto';
import { WxLoginDto } from './dto/wxLogin.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('wx-login')
  wxLogin(@Body() dto: WxLoginDto) {
    return this.authService.wxLogin(dto.code);
  }

  @Post('bind-employee')
  bindEmployee(@Body() dto: BindEmployeeDto) {
    return this.authService.bindEmployee(dto);
  }

  @Get('profile')
  profile() {
    return 'profile';
  }
}
