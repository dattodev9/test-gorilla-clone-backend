import { IsNumber, IsString, Length } from "class-validator";
import { Choice } from "src/entities/one-choice-question.entity";

export class CreateOneChoiceQuestionRequestDto {
    @IsString()
    @Length(2, 50)
    name: string;

    @IsString()
    @Length(2, 50)
    content: string;

    choice: Choice[];

    @IsString()
    key: string;

    @IsNumber()
    time: number;

    @IsNumber()
    order: number;

    @IsString()
    testId: string;
}