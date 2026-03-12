import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Code2SessionResponse } from './interfaces/code2Session.interface';

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

    if ('errcode' in data) {
      throw new Error(data.errmsg || '微信登录失败');
    }

    return data;
  }
}
