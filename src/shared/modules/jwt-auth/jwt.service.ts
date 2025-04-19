import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../../entities/user.entity';

export interface JwtPayload {
  sub: number;
  username: string;
  role: UserRole;
  type: 'accessToken' | 'refreshToken';
  iat: string;
  exp: string;
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: any, expiresIn: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('TOKEN_PRIVATE_KEY'),
      expiresIn: expiresIn,
    });
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('TOKEN_PRIVATE_KEY'),
    });
  }
}
