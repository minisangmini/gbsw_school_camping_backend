import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Type } from 'class-transformer';
import { IsArray, IsDateString } from 'class-validator';
import { StudentInfoDto } from 'src/common/dto/studentInfo.dto';

export class ValidationStudentRequestDto {
  @ApiProperty({ description: "학생들의 정보", type: StudentInfoDto, isArray: true })
  @IsArray()
  @Type(() => StudentInfoDto)
  studentsInfo: StudentInfoDto[];

  @ApiProperty({ description: "예약 날짜", example: "2006-08-28" })
  @IsDateString()
  date: string;
}