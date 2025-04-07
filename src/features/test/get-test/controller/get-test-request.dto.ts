import { PaginationRequestDto } from '../../../../common/pagination/pagination-request-dto';
import { IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTestRequestDto extends PaginationRequestDto {
  @IsString()
  @Length(1, 50)
  @IsOptional()
  @Type(() => String)
  name?: string;
}