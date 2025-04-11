import { PaginationRequestDto } from "src/common/pagination/pagination-request-dto";
import { AssessmentStatus } from "src/entities/assessment.entity";

export class GetAssessmentCommand extends PaginationRequestDto {
    name?: string;
    status?: AssessmentStatus[];
}