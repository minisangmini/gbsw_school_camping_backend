import { ApiProperty } from "@nestjs/swagger";
import { StudentInfoDto } from "src/common/dto/studentInfo.dto";

export default class BanDateResponseDto {
  @ApiProperty({ description: "시작 날짜", example: "2006-08-28" })
  startDate: string

  @ApiProperty({ description: "끝 날짜", example: "2006-08-29" })
  endDate: string

  @ApiProperty({ description: "금지 된 이유", example: "시험 기간" })
  reason: string
}