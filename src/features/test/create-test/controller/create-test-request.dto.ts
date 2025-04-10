import { IsEnum, IsString, Length } from "class-validator";
import { TestStatus } from "src/entities/test.entity";

export class CreateTestRequestDto{
    @Length(2, 50)
    @IsString()
    name: string;

    @Length(2, 100)
    @IsString()
    description: string;

    @IsEnum(TestStatus)
    status: TestStatus;
}