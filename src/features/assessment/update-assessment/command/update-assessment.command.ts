import { AssessmentStatus } from "src/entities/assessment.entity";

export class UpdateAssessmentCommand {
    name?: string;
    jobRole?: string;
    testIds?: string[];
    status?: AssessmentStatus;
}