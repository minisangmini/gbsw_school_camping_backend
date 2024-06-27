import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { StudentInfoDto } from 'src/common/dto/studentInfo.dto';

export class ValidationStudentResponseDto {
  @ApiProperty({ description: "캠핑한 지 30일이 안 된 학생들의 정보", type: StudentInfoDto, isArray: true })
  unavailable: StudentInfoDto[];

  @ApiProperty({ description: "블랙리스트 된 학생들의 정보", type: StudentInfoDto, isArray: true })
  bans: StudentInfoDto[];
}