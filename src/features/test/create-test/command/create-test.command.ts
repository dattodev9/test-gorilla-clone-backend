import { TestStatus } from 'src/entities/test.entity';

export class CreateTestCommand {
    name: string;
    description: string;
    status: TestStatus;
}