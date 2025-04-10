import { ArrayMinSize, IsArray, IsNumber, IsString, Length, Min } from "class-validator";
import { Choice } from "src/entities/one-choice-question.entity";

export class CreateMultipleChoiceQuestionRequestDto {
    @IsString()
    @Length(2, 50)
    name: string;

    @IsString()
    @Length(2, 50)
    content: string;

    @IsArray()
    @ArrayMinSize(1)
    choices: Choice[];

    @IsString()
    @ArrayMinSize(1)
    key: string[];

    @IsNumber()
    @Min(1)
    time: number;

    @IsNumber()
    order: number;

    @IsString()
    testId: string;
}