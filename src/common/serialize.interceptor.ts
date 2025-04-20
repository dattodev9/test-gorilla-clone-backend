import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToInstance, instanceToPlain } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data && data.data && Array.isArray(data.data)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return {
            ...data,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
            data: data.data.map((item) =>
              plainToInstance(this.dto, instanceToPlain(item), {
                excludeExtraneousValues: true,
              }),
            ),
          };
        } else if (Array.isArray(data)) {
          return data.map((item) =>
            plainToInstance(this.dto, instanceToPlain(item), {
              excludeExtraneousValues: true,
            }),
          );
        } else {
          return plainToInstance(this.dto, instanceToPlain(data), {
            excludeExtraneousValues: true,
          });
        }
      }),
    );
  }
}
