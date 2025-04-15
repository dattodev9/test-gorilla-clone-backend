import {
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';
import { LogoutCommandHandler } from '../command/logout.command-handler';
import { Response } from 'express';

@Controller('/logout')
export class LogoutController {
  constructor(private readonly handler: LogoutCommandHandler) {}

  @Post()
  @HttpCode(204)
  public async signIn(@Res() res: Response) {
    try {
      return await this.handler.execute(res);
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(error);
    }
  }
}
