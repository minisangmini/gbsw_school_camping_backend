import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";


export class StudentInfoDto {
  @ApiProperty({ description: "학생 이름", example: "이상민", minLength: 3, maxLength: 4 })
  @IsString()
  @Length(3, 4)
  studentName: string;

  @ApiProperty({ description: "학번", example: "3211", minLength: 4, maxLength: 4 })
  @IsString()
  @Length(4, 4)
  studentId: string;
}