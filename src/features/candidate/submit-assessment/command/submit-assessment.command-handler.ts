import { InjectRepository } from '@nestjs/typeorm';
import {
  Candidate,
  CandidateStatus,
  DoneTests,
} from '../../../../entities/candidate.entity';
import { Repository } from 'typeorm';
import { OneChoiceQuestion } from '../../../../entities/one-choice-question.entity';
import { MultipleChoiceQuestion } from '../../../../entities/multiple-choice-question.entity';
import { SubmitAssessmentCommand } from './submit-assessment.command';
import { QuestionNotFoundError } from '../error/question-not-found.error';
import { CandidateNotFoundError } from '../error/candidate-not-found.error';
import { CandidateStatusInvalidError } from '../error/candidate-status-invalid.error';
import { Test } from '../../../../entities/test.entity';
import { TestNotFoundError } from '../error/test-not-found.error';
import { Assessment, AssessmentStatus } from 'src/entities/assessment.entity';

export class SubmitAssessmentCommandHandler {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
    @InjectRepository(OneChoiceQuestion)
    private oneChoiceQuestion: Repository<OneChoiceQuestion>,
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceQuestion: Repository<MultipleChoiceQuestion>,
  ) {}

  public async execute(id: string, command: SubmitAssessmentCommand) {
    const candidate = await this.candidateRepository.findOne({
      where: {
        id: id,
      },
      relations: ['assessment'],
    });

    if (!candidate) {
      throw new CandidateNotFoundError();
    }

    if (candidate.status !== CandidateStatus.ACTIVE) {
      throw new CandidateStatusInvalidError();
    }

    const { tests } = command;
    const doneTest: DoneTests[] = [];

    for (const test of tests) {
      let totalPoint: number = 0;
      const existTest = await this.testRepository.findOne({
        select: ['id', 'name'],
        where: {
          id: test.id,
        },
        relations: ['one_choice_question', 'multiple_choice_question'],
      });

      if (!existTest) {
        throw new TestNotFoundError();
      }

      console.log(existTest);

      for (const answer of test.questionAnswers) {
        if (answer.type === 'one-choice-question') {
          const question = await this.oneChoiceQuestion.findOne({
            select: ['choices', 'key'],
            where: { id: answer.id },
          });

          if (!question) {
            throw new QuestionNotFoundError();
          }

          const trueAnswer = question.choices.find(
            (value) => value.key === question.key,
          )?.key;

          if (answer.answer === trueAnswer) {
            totalPoint += 1;
          }
        } else if (answer.type === 'multiple-choice-question') {
          const question = await this.multipleChoiceQuestion.findOne({
            select: ['choices', 'key'],
            where: { id: answer.id },
          });

          if (!question) {
            throw new QuestionNotFoundError();
          }

          const trueAnswers = question.choices
            .filter((value) => question.key.includes(value.key))
            .map((value) => value.key);

          const userAnswers = answer.answer.split(',').map((ans) => ans.trim());

          let questionPoint = 0;

          for (const userAnswer of userAnswers) {
            if (trueAnswers.includes(userAnswer)) {
              questionPoint += 1;
            } else {
              questionPoint -= 1;
            }
          }

          if (questionPoint > 0) {
            totalPoint += Math.round(questionPoint / question.key.length);
          }
        }
      }

      const overall = Math.round(
        (totalPoint / test.questionAnswers.length) * 100,
      );

      const totalOneChoiceQuestionTime =
        (existTest.oneChoiceQuestions.length > 0 &&
          existTest.oneChoiceQuestions.reduce(
            (totalTestTime, question) => question.time,
            0,
          )) ||
        0;

      const totalMultipleChoiceQuestionTime =
        (existTest.multipleChoiceQuestions.length > 0 &&
          existTest.multipleChoiceQuestions.reduce(
            (totalTestTime, question) => question.time,
            0,
          )) ||
        0;

      doneTest.push({
        id: test.id,
        name: existTest.name,
        overall: overall,
        time: test.time,
        totalTime: totalOneChoiceQuestionTime + totalMultipleChoiceQuestionTime,
      });
    }

    await this.assessmentRepository.update(candidate.assessment.id, {
      status: AssessmentStatus.ACTIVE,
    });

    return await this.candidateRepository.save({
      ...candidate,
      doneTests: doneTest,
      status: CandidateStatus.DONE,
    });
  }
}
