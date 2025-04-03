import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from 'src/shared/modules/jwt-auth/jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = req.cookies['accessToken'];

    if (!token) return false;

    try {
      const decoded = this.jwtService.verifyToken(token);
      req['user'] = decoded;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
