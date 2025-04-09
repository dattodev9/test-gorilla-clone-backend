import { IsArray, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Choice } from "src/entities/one-choice-question.entity";

export class UpdateMultipleChoiceQuestionRequestDto {
    @IsString()
    @Length(2, 50)
    @IsOptional()
    name: string;

    @IsString()
    @Length(2, 50)
    @IsOptional()
    content: string;

    @IsOptional()
    choices: Choice[];

    @IsOptional()
    @IsArray()
    key: string[];

    @IsOptional()
    @IsNumber()
    time: number;

    @IsOptional()
    @IsNumber()
    order: number;

    @IsOptional()
    @IsString()
    testId: string;
}