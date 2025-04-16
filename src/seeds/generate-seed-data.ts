import { faker } from '@faker-js/faker';
import { Assessment, AssessmentStatus } from '../entities/assessment.entity';
import { Candidate, CandidateStatus } from '../entities/candidate.entity';
import { Test, TestStatus } from '../entities/test.entity';
import { User, UserRole } from '../entities/user.entity';
import { OneChoiceQuestion } from '../entities/one-choice-question.entity';
import { MultipleChoiceQuestion } from '../entities/multiple-choice-question.entity';

export const generateSeedData = () => {
  const users: User[] = Array.from({ length: 50 }, () => ({
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    name: faker.name.fullName(),
    role: faker.helpers.arrayElement(Object.values(UserRole)),
    hasChangedPassword: faker.datatype.boolean(),
    createdAt: faker.date.past(),
  }));

  const tests: Test[] = Array.from({ length: 50 }, () => ({
    id: faker.string.uuid(),
    name: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(Object.values(TestStatus)),
    createdAt: faker.date.past(),
    oneChoiceQuestions: [],
    multipleChoiceQuestions: [],
  }));

  const oneChoiceQuestions: OneChoiceQuestion[] = Array.from(
    { length: 50 },
    () => ({
      id: faker.string.uuid(),
      name: faker.lorem.words(3),
      content: faker.lorem.sentence(),
      choices: Array.from({ length: 4 }, () => ({
        key: faker.string.alpha({ length: 1 }),
        value: faker.lorem.word(),
      })),
      key: faker.string.alpha({ length: 1 }),
      time: faker.number.int({ min: 10, max: 300 }),
      order: faker.number.int({ min: 1, max: 50 }),
      test: faker.helpers.arrayElement(tests),
    }),
  );

  const multipleChoiceQuestions: MultipleChoiceQuestion[] = Array.from(
    { length: 50 },
    () => ({
      id: faker.string.uuid(),
      name: faker.lorem.words(3),
      content: faker.lorem.sentence(),
      choices: Array.from({ length: 4 }, () => ({
        key: faker.string.alpha({ length: 1 }),
        value: faker.lorem.word(),
      })),
      key: Array.from({ length: 2 }, () => faker.string.alpha({ length: 1 })),
      time: faker.number.int(15),
      order: faker.number.int({ min: 1, max: 50 }),
      test: faker.helpers.arrayElement(tests),
    }),
  );

  const assessments: Assessment[] = Array.from({ length: 50 }, () => ({
    id: faker.string.uuid(),
    name: faker.lorem.words(3),
    jobRole: faker.name.jobTitle(),
    status: faker.helpers.arrayElement(Object.values(AssessmentStatus)),
    tests: faker.helpers.arrayElements(
      tests,
      faker.number.int({ min: 1, max: 5 }),
    ),
    candidates: [],
    createdAt: faker.date.past(),
  }));

  const candidates: Candidate[] = Array.from({ length: 50 }, () => ({
    id: faker.string.uuid(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
    doneTests: [],
    status: faker.helpers.arrayElement(Object.values(CandidateStatus)),
    takeDate: faker.datatype.boolean() ? faker.date.past() : undefined,
    createdAt: faker.date.past(),
    assessment: faker.helpers.arrayElement(assessments),
  }));

  return {
    users,
    tests,
    oneChoiceQuestions,
    multipleChoiceQuestions,
    assessments,
    candidates,
  };
};

generateSeedData();
