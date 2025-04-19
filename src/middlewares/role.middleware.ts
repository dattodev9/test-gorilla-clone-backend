import { ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function RoleMiddleware(requiredRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const userRole = req['user']?.role;

    if (!userRole || !requiredRoles.includes(userRole)) {
      console.log('Required roles:', requiredRoles);
      console.log('User role:', userRole);

      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    next();
  };
}
