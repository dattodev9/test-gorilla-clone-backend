import { CookieOptions } from 'express';

export const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  path: '/',
};
