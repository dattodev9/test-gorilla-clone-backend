import { Choice } from "src/entities/one-choice-question.entity";

export class CreateOneChoiceQuestionCommand {
    name: string;

    content: string;

    choice: Choice[];

    key: string;
    
    time: number;

    order: number;

    testId: string;
}