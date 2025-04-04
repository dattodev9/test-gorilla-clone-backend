import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

enum ORDER {
    ASC = "asc",
    DESC = "desc"
}

export class PageOptionsDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    take?: number = 10;

    @IsOptional()
    @IsEnum(ORDER)
    order: ORDER = ORDER.ASC;
    
    @IsOptional()
    @IsString()
    orderKey: string;
}