import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReservationStatus } from 'src/modules/camping/entities/reservation_status.entity';

export default class CalendarResponseDto {
  @ApiProperty({ example: '01 ~ 31', description: '달의 모든 날짜, 포맷(DD) 형태' })
  date: string;

  @ApiProperty({ enum: ReservationStatus, description: '예약 상테' })
  status: ReservationStatus;

  @ApiPropertyOptional({ description: '예약 완료일 때만 반환됩다다', example: 1 })
  id?: number;
}