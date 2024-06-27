import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString, MaxLength, } from "class-validator";


export default class BanDateRequestDto {
  @ApiProperty({ description: "날짜", example: "2006-08-28" })
  @IsDateString()
  date: string

  @ApiProperty({ description: "이유", example: "시험 기간" })
  @IsString()
  @MaxLength(20)
  reason: string
}
