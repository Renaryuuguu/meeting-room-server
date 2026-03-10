import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Code2SessionResponse {
  session_key: string;
  unionid: string;
  openid: string;
  errcode: number;
  errmsg: string;
}

@Injectable()
export class WxService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async code2Session(code: string) {
    const appid = this.configService.getOrThrow<string>('WECHAT_APPID');
    const secret = this.configService.getOrThrow<string>('WECHAT_SECRET');

    const url = 'https://api.weixin.qq.com/sns/jscode2session';

    const { data } = await this.httpService.axiosRef.get<Code2SessionResponse>(
      url,
      {
        params: {
          appid,
          secret,
          js_code: code,
          grant_type: 'authorization_code',
        },
      },
    );

    if (data.errcode) {
      throw new Error(data.errmsg || '微信登录失败');
    }

    return data;
  }
}
