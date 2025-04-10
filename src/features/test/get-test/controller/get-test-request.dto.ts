import { PaginationRequestDto } from '../../../../common/pagination/pagination-request-dto';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TestStatus } from 'src/entities/test.entity';

export class GetTestRequestDto extends PaginationRequestDto {
  @IsString()
  @Length(1, 50)
  @IsOptional()
  @Type(() => String)
  name?: string;

  @IsEnum(TestStatus, { each: true })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: TestStatus[];
}