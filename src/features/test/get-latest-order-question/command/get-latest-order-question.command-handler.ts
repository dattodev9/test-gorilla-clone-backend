import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MultipleChoiceQuestion } from "src/entities/multiple-choice-question.entity";
import { OneChoiceQuestion } from "src/entities/one-choice-question.entity";
import { AppDataSource } from "src/shared/app-data-source";
import { DataSource, Repository } from "typeorm";

Inject()

export class GetLatestOrderQuestionCommandHandler {
    constructor(
        private datasource: DataSource,
        @InjectRepository(OneChoiceQuestion)
        private oneChoiceQuestionRepository: Repository<OneChoiceQuestion>,
        @InjectRepository(MultipleChoiceQuestion)
        private multipleChoiceQuestionRepository: Repository<MultipleChoiceQuestion>
    ){}

    public async execute(testId: string) {
        // const latestOrder = await this.oneChoiceQuestionRepository.findOne({
        //     where: {
        //         test: {
        //             id: testId
        //         }
        //     },
            
        // })
        const latestOrder  = await this.datasource.createQueryBuilder()
            .select("one_choice_question.order", "order")
            .from(OneChoiceQuestion, "one_choice_question")
            .where("one_choice_question.test_id = :testId", { testId })
            .orderBy("one_choice_question.order", "DESC")
            .limit(1)
            .getRawOne<{
                order: string
            } >();
    
        console.log(latestOrder);
        return latestOrder;t las
    }
}