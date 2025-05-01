import { TestStatus } from '../../../../entities/test.entity';

export class UpdateTestCommand {
  name?: string;
  description?: string;
  status?: TestStatus;
}
