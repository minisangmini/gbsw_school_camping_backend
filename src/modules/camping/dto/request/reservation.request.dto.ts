import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsString, Length, ValidateNested } from "class-validator";
import { StudentInfoDto } from "src/common/dto/studentInfo.dto";

export default class ReservationRequestDto {
  @ApiProperty({ description: "대표 학생 정보", type: () => StudentInfoDto })
  @ValidateNested()
  @Type(() => StudentInfoDto)
  leader: StudentInfoDto;

  @ApiProperty({ description: "참여 학생들 정보", type: () => [StudentInfoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentInfoDto)
  students: StudentInfoDto[];

  @ApiProperty({ description: "담당 교사 이름", example: "서승범", minLength: 3, maxLength: 4 })
  @IsString()
  @Length(3, 4)
  teacherName: string;

  @ApiProperty({ description: "예약 날짜", example: "2006-08-28" })
  @IsDateString()
  reservationDate: string;

  @ApiProperty({ description: "비밀번호", minLength: 4, maxLength: 4, example: "1234" })
  @IsString()
  @Length(4, 4)
  password: string;
}
