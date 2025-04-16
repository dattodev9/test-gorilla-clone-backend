import { Inject } from '@nestjs/common';
import { Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

Inject();

export class LogoutCommandHandler {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async execute(res: Response) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await this.cacheManager.del(`refreshToken-${res.username}`);

    res.clearCookie('accessToken');

    res.clearCookie('refreshToken');

    return res.status(204).send();
  }
}
