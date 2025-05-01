import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { TestStatus } from '../../../../entities/test.entity';

export class UpdateTestRequestDto {
  @Length(2, 50)
  @IsString()
  @IsOptional()
  name?: string;

  @Length(2, 100)
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TestStatus)
  @IsOptional()
  status?: TestStatus;
}
