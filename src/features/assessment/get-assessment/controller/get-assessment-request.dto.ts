import { ArrayMinSize, IsArray, IsOptional, IsString, Length } from "class-validator";
import { PaginationRequestDto } from "src/common/pagination/pagination-request-dto";
import { AssessmentStatus } from "src/entities/assessment.entity";

export class GetAssessmentRequestDto extends PaginationRequestDto {
    @IsString()
    @IsOptional()
    @Length(2, 100)
    name?: string;

    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    status?: AssessmentStatus[];
}