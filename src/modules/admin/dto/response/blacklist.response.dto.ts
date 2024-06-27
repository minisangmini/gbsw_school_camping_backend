import { ApiProperty } from "@nestjs/swagger";
import { StudentInfoDto } from "src/common/dto/studentInfo.dto";

export default class BlacklistResponseDto extends StudentInfoDto{
  @ApiProperty({ description: "블랙 된 이유", example: "청소 안 함" })
  reason: string
}