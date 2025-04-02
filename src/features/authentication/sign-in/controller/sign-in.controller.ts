import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { SignInRequestDto } from './sign-in-request.dto';
import { UserNotFoundError } from '../error/user-not-found.error';
import { PasswordIncorrectError } from '../error/password-incorrect.error';
import { SignInCommandHandler } from '../command/sign-in.command-handler';

@Controller('/signIn')
export class SignInController {
  constructor(private readonly handler: SignInCommandHandler) {}

  @Post()
  public async signIn(@Body() signInRequestDto: SignInRequestDto) {
    try {
      return await this.handler.execute(signInRequestDto);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException('User not found');
      } else if (error instanceof PasswordIncorrectError) {
        throw new BadRequestException('Password is incorrect');
      }
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
