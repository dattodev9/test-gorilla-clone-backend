import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  JwtModule as NestJwtModule,
  JwtService as NestJwtService,
} from '@nestjs/jwt';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_PRIVATE_KEY'),
        global: true,
      }),
    }),
  ],
  providers: [ConfigService, NestJwtService, JwtService],
  exports: [JwtService],
})
export class JwtModule {}
