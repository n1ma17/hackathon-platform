import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinDate,
  MinLength,
} from 'class-validator';

export class CreateHackathonDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @Type(() => Date)
  @IsDate()
  @MinDate(() => new Date(), { message: 'startAt must be a future date' })
  startAt: Date;

  @Type(() => Date)
  @IsDate()
  @MinDate(() => new Date(), { message: 'endAt must be a future date' })
  endAt: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
