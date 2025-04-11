import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

enum ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationRequestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  size?: number = 10;

  @IsOptional()
  @IsEnum(ORDER)
  direction: ORDER = ORDER.DESC;

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';
}
