import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { SignInRequestDto } from './sign-in-request.dto';
import { UserNotFoundError } from '../error/user-not-found.error';
import { PasswordIncorrectError } from '../error/password-incorrect.error';
import { SignInCommandHandler } from '../command/sign-in.command-handler';
import { Response } from 'express';

@Controller('/sign-in')
export class SignInController {
  constructor(private readonly handler: SignInCommandHandler) {}

  @Post()
  @HttpCode(204)
  public async signIn(
    @Res() res: Response,
    @Body() signInRequestDto: SignInRequestDto,
  ) {
    try {
      return await this.handler.execute(res, signInRequestDto);
    } catch (error) {
      console.error(error);

      if (error instanceof UserNotFoundError) {
        throw new NotFoundException('User not found');
      } else if (error instanceof PasswordIncorrectError) {
        throw new BadRequestException('Password is incorrect');
      }
      throw new InternalServerErrorException(error);
    }
  }
}
