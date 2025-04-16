import { DataSource } from 'typeorm';
import { generateSeedData } from './generate-seed-data';
import { AppDataSource } from 'src/shared/app-data-source';

const seedDatabase = async () => {
  const dataSource: DataSource = await AppDataSource.initialize();
  console.log('Database connected.');

  const {
    users,
    tests,
    oneChoiceQuestions,
    multipleChoiceQuestions,
    assessments,
    candidates,
  } = generateSeedData();

  try {
    await dataSource.getRepository('User').save(users);
    await dataSource.getRepository('Test').save(tests);
    await dataSource
      .getRepository('OneChoiceQuestion')
      .save(oneChoiceQuestions);
    await dataSource
      .getRepository('MultipleChoiceQuestion')
      .save(multipleChoiceQuestions);
    await dataSource.getRepository('Assessment').save(assessments);
    await dataSource.getRepository('Candidate').save(candidates);

    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed.');
  }
};

seedDatabase();
