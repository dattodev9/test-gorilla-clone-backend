import { PaginationRequestDto } from "src/common/pagination/pagination-request-dto"
import { TestStatus } from "src/entities/test.entity";

export class GetTestCommand extends PaginationRequestDto {
  name?: string;

  status?: TestStatus[];
}