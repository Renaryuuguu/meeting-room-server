import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { WxService } from '@/modules/wx/wx.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private wxService: WxService,
  ) {}

  async wxLogin(code: string) {
    const wxUser = await this.wxService.code2Session(code);

    const user = {
      id: 1,
      openid: wxUser.openid,
      role: 'employee',
      name: '未命名用户',
    };

    const payload = {
      sub: user.id,
      openid: user.openid,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    return {
      accessToken,
      userInfo: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };
  }
}
