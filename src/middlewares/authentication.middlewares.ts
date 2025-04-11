/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/entities/user.entity';
import { JwtService } from 'src/shared/modules/jwt-auth/jwt.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies['accessToken'];

      if (accessToken) {
        const accessTokenPayload =
          await this.jwtService.verifyToken(accessToken);
        await this.validateUser(accessTokenPayload.username);
        res.set('username', accessTokenPayload.username);
        return next();
      }
    } catch (error) {
      console.log('Access token validation failed:', error.message);
    }

    try {
      console.log('Attempting to validate refresh token');
      await this.handleRefreshToken(req, res, next);
    } catch (error) {
      console.error('Refresh token validation failed:', error.message);
      throw new ForbiddenException('Authentication failed');
    }
  }

  private async handleRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token is missing or invalid');
    }

    const refreshTokenPayload = await this.jwtService.verifyToken(refreshToken);
    const username = refreshTokenPayload?.username;

    const cachedRefreshToken = await this.cacheManager.get<string>(
      `refreshToken-${username}`,
    );
    if (refreshToken !== cachedRefreshToken) {
      throw new ForbiddenException('Refresh token is invalid');
    }

    const { type, iat, exp, ...newAccessTokenPayload } = refreshTokenPayload;

    const newAccessToken = await this.jwtService.generateToken(
      { ...newAccessTokenPayload, type: 'accessToken' },
      '15m',
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });

    res.set('username', username);
    next();
  }

  private async validateUser(username: string) {
    const userInfo = await this.userRepository.findOne({
      select: {
        username: true,
        name: true,
        role: true,
        hasChangedPassword: true,
      },
      where: { username },
    });

    if (!userInfo) {
      throw new ForbiddenException('User not found or invalid');
    }
  }
}
