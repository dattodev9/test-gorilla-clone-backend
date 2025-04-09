import { Choice } from "src/entities/one-choice-question.entity";

export class CreateOneChoiceQuestionCommand {
    name: string;

    content: string;

    choices: Choice[];

    key: string;
    
    time: number;

    order: number;

    testId: string;
}