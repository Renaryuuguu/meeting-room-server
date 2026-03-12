import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';

import { WxModule } from '@/modules/wx/wx.module';
import { PrimsaModule } from '@/prisma/prisma.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = (configService.get('JWT_EXPIRES_IN') ??
          '7d') as JwtSignOptions['expiresIn'];

        return {
          global: true,
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
    WxModule,
    PrimsaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
