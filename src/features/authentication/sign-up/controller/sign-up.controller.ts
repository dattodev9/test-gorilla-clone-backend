import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { SignUpCommandHandler } from '../command/sign-up.command-handler';
import { SignUpRequestDto } from './sign-up-request.dto';
import { UsernameExistedError } from '../error/username-existed.error';

@Controller('/signUp')
export class SignUpController {
  constructor(private readonly handler: SignUpCommandHandler) {}

  @Post()
  @HttpCode(201)
  public async signUp(@Body() signUpRequestDto: SignUpRequestDto) {
    try {
      await this.handler.execute(signUpRequestDto);
    } catch (error) {
      if (error instanceof UsernameExistedError) {
        throw new BadRequestException('Username already existed');
      }
      throw new InternalServerErrorException('Something has gone wrong');
    }
  }
}
