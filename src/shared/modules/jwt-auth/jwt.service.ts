import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: any): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('TOKEN_PRIVATE_KEY'),
      expiresIn: '60s',
    });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('TOKEN_PRIVATE_KEY'),
      });
    } catch (error) {
      console.error(error);
    }
  }
}
