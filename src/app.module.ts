import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from '@/modules/auth/auth.module';
import { BookingModule } from '@/modules/booking/booking.module';
import { MeetingRoomModule } from '@/modules/meeting-room/meeting-room.module';
import { UserModule } from '@/modules/user/user.module';

import { WxModule } from './modules/wx/wx.module';
import { PrimsaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
      expandVariables: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    PrimsaModule,
    RedisModule,
    AuthModule,
    UserModule,
    MeetingRoomModule,
    BookingModule,
    WxModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
