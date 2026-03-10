import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WxService } from './wx.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [WxService],
  exports: [WxService],
})
export class WxModule {}
