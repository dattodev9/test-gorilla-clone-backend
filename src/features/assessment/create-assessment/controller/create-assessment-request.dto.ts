import { ArrayMaxSize, ArrayMinSize, IsArray, IsString, Length } from "class-validator";

export class CreateAssessmentRequestDto {
    @IsString()
    @Length(2, 100)
    name: string;

    @IsString()
    @Length(2, 100)
    jobRole: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(5)
    testIds: string[];
}