import { Inject } from '@nestjs/common';
import { Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { COOKIE_CONFIG } from 'src/configs/cookie.config';

Inject();

export class LogoutCommandHandler {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async execute(res: Response) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await this.cacheManager.del(`refreshToken-${res.username}`);

    res.clearCookie('accessToken', COOKIE_CONFIG);

    res.clearCookie('refreshToken', COOKIE_CONFIG);

    return res.status(204).send();
  }
}
