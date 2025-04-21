import { faker } from '@faker-js/faker';

import { User, UserRole } from '../entities/user.entity';
import { Test, TestStatus } from '../entities/test.entity';
import {
  OneChoiceQuestion,
  Choice,
} from '../entities/one-choice-question.entity';
import { MultipleChoiceQuestion } from '../entities/multiple-choice-question.entity';
import { Assessment, AssessmentStatus } from '../entities/assessment.entity';
import { Candidate, CandidateStatus } from '../entities/candidate.entity';
import { connectionSource } from '../configs/typeorm.config';

export const generateSeedData = () => {
  const users: User[] = Array.from({ length: 50 }, () => ({
    id: faker.string.uuid(),
    username: faker.internet.username(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
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
    codingQuestions: [],
  }));

  const oneChoiceQuestions: OneChoiceQuestion[] = [];
  const multipleChoiceQuestions: MultipleChoiceQuestion[] = [];

  tests.forEach((test) => {
    const oneQCount = faker.number.int({ min: 2, max: 5 });
    const multiQCount = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < oneQCount; i++) {
      const choices: Choice[] = ['A', 'B', 'C', 'D'].map((k) => ({
        key: k,
        value: faker.lorem.word(),
      }));

      oneChoiceQuestions.push({
        id: faker.string.uuid(),
        name: faker.lorem.words(3),
        content: faker.lorem.sentence(),
        choices,
        key: faker.helpers.arrayElement(choices).key,
        time: faker.number.int({ min: 30, max: 120 }),
        order: i + 1,
        test,
      });
    }

    for (let i = 0; i < multiQCount; i++) {
      const choices: Choice[] = ['A', 'B', 'C', 'D'].map((k) => ({
        key: k,
        value: faker.lorem.word(),
      }));

      const correctKeys = faker.helpers.arrayElements(
        choices.map((c) => c.key),
        2,
      );

      multipleChoiceQuestions.push({
        id: faker.string.uuid(),
        name: faker.lorem.words(3),
        content: faker.lorem.sentence(),
        choices,
        key: correctKeys,
        time: faker.number.int({ min: 30, max: 120 }),
        order: i + 1,
        test,
      });
    }
  });

  const assessments: Assessment[] = Array.from({ length: 50 }, () => {
    const selectedTests = faker.helpers.arrayElements(
      tests,
      faker.number.int({ min: 1, max: 3 }),
    );
    return {
      id: faker.string.uuid(),
      name: faker.lorem.words(3),
      jobRole: faker.person.jobTitle(),
      status: faker.helpers.arrayElement(Object.values(AssessmentStatus)),
      tests: selectedTests,
      candidates: [],
      createdAt: faker.date.past(),
    };
  });

  const candidates: Candidate[] = Array.from({ length: 50 }, () => {
    const assessment = faker.helpers.arrayElement(assessments);
    const doneTests = assessment.tests.map((t) => ({
      id: t.id,
      name: t.name,
      overall: faker.number.int({ min: 60, max: 100 }),
      time: faker.number.int({ min: 60, max: 120 }),
      totalTime: faker.number.int({ min: 60, max: 120 }),
    }));

    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      status: faker.helpers.arrayElement(Object.values(CandidateStatus)),
      doneTests: faker.datatype.boolean() ? doneTests : [],
      takeDate: faker.datatype.boolean() ? faker.date.past() : undefined,
      createdAt: faker.date.past(),
      assessment,
    };
  });

  return {
    users,
    tests,
    oneChoiceQuestions,
    multipleChoiceQuestions,
    assessments,
    candidates,
  };
};

export const seedDatabase = async () => {
  const {
    users,
    tests,
    oneChoiceQuestions,
    multipleChoiceQuestions,
    assessments,
    candidates,
  } = generateSeedData();

  try {
    await connectionSource.initialize();

    await connectionSource.getRepository(User).save(users);
    await connectionSource.getRepository(Test).save(tests);
    await connectionSource
      .getRepository(OneChoiceQuestion)
      .save(oneChoiceQuestions);
    await connectionSource
      .getRepository(MultipleChoiceQuestion)
      .save(multipleChoiceQuestions);
    await connectionSource.getRepository(Assessment).save(assessments);
    await connectionSource.getRepository(Candidate).save(candidates);

    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
    await connectionSource.destroy();
    console.log('Database connection closed.');
  }
};

seedDatabase();
