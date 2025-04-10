import { ArrayMinSize } from "@nestjs/class-validator";
import { IsArray, IsNumber, IsString, Length, Min } from "class-validator";
import { Choice } from "src/entities/one-choice-question.entity";

export class CreateOneChoiceQuestionRequestDto {
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
    key: string;

    @IsNumber()
    @Min(1)
    time: number;

    @IsNumber()
    order: number;

    @IsString()
    testId: string;
}