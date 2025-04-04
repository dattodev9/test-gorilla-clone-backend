import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { SignUpCommandHandler } from '../command/sign-up.command-handler';
import { SignUpRequestDto } from './sign-up-request.dto';
import { UsernameExistedError } from '../error/username-existed.error';

@Controller('/sign-up')
export class SignUpController {
  constructor(private readonly handler: SignUpCommandHandler) {}

  @Post()
  public async signUp(@Body() signUpRequestDto: SignUpRequestDto) {
    try {
      await this.handler.execute(signUpRequestDto);
    } catch (error) {
      if (error instanceof UsernameExistedError) {
        throw new BadRequestException('Username already existed');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
