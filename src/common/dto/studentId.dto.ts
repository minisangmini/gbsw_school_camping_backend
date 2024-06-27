import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export default class StudentIdDto {
  @ApiProperty({ description: "학번", example: "3211", minLength: 4, maxLength: 4 })
  @IsString()
  @Length(4, 4)
  studentId: string;
}