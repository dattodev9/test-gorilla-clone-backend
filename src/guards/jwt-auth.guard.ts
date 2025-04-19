import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  JwtPayload,
  JwtService,
} from 'src/shared/modules/jwt-auth/jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token: string | null = req.cookies['accessToken'];

    if (!token) return false;

    try {
      const decoded: JwtPayload = await this.jwtService.verifyToken(token);
      req['user'] = decoded;
      req['role'] = decoded.role;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
