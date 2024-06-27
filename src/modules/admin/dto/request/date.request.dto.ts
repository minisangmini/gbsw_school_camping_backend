import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";


export default class DateRequestDto {
  @ApiProperty({ description: '날짜', isArray: true, example: '2006-08-28' })
  @IsDateString()
  date: string
}
