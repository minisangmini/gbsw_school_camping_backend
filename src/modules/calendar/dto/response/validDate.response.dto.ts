import { ApiProperty } from '@nestjs/swagger';

export default class ValidDateResponse {
  @ApiProperty({ description: '오늘이 신청 기간인 지 확인', example: true })
  isValidToday: boolean;

  @ApiProperty({ description: '신청 기간 시작 날짜', example: '2024-06-24' })
  validFirstDate: string;

  @ApiProperty({ description: '신청 마지막 날짜', example: '2024-06-38' })
  validLastDate: string;
}
