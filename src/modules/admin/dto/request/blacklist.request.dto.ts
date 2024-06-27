import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";
import { StudentInfoDto } from "src/common/dto/studentInfo.dto";

export default class BlacklistRequestDto extends StudentInfoDto{
  @ApiProperty({ description: "블랙 된 이유", example: "청소 안 함" })
  @IsString()
  @MaxLength(20)
  reason: string
}