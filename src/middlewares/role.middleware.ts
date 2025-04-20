import { ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function RoleMiddleware(requiredRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const userRole = req['user']?.role;

    if (!userRole) {
      throw new ForbiddenException(
        'Authentication required to access this resource',
      );
    }

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. Your role: ${userRole}`,
      );
    }

    next();
  };
}
