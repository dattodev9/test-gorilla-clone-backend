import { PaginationRequestDto } from "src/common/pagination/pagination-request-dto"

export class GetTestCommand extends PaginationRequestDto {
  name: string;
}