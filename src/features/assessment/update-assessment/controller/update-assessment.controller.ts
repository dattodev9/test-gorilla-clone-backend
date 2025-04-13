import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateAssessmentCommandHandler } from '../command/update-assessment.command-handler';
import { UpdateAssessmentRequestDto } from './update-assessment-request.dto';
import { AssessmentNotFoundError } from '../error/assessment-not-found.error';
import { AssessmentStatusNotValidError } from '../error/assessment-status-not-valid.error';

@Controller('/assessment')
export class UpdateAssessmentController {
  constructor(private handler: UpdateAssessmentCommandHandler) {}

  @Patch(':id')
  public async updateAssessment(
    @Param('id') id: string,
    @Body() request: UpdateAssessmentRequestDto,
  ) {
    try {
      return await this.handler.execute(id, request);
    } catch (error) {
      console.error(error);

      if (error instanceof AssessmentNotFoundError) {
        throw new NotFoundException('Assessment not found');
      }

      if (error instanceof AssessmentStatusNotValidError) {
        throw new BadRequestException('Assessment status is invalid to update');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
