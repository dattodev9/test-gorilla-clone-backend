import {
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { DuplicateAssessmentCommandHandler } from '../command/duplicate-assessment.command-handler';
import { AsssessmentNotFoundError } from '../error/assessment-not-found.error';

@Controller('/assessment/:id/duplicate')
export class DuplicateAssessmentController {
  constructor(private handler: DuplicateAssessmentCommandHandler) {}

  @Post()
  public async duplicateAssessment(@Param('id') id: string) {
    try {
      return await this.handler.execute(id);
    } catch (error) {
      console.error(error);

      if (error instanceof AsssessmentNotFoundError) {
        throw new NotFoundException('Assessment not found!');
      }

      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
