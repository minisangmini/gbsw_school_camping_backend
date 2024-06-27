import { ApiProperty } from '@nestjs/swagger';
import ReservationInfoDto from 'src/common/dto/reservation.dto';
import { ReservationStatus } from 'src/modules/camping/entities/reservation_status.entity';


export default class ReservationResponseDto {
  @ApiProperty({ example: '21', description: 'The day of the month in DD format.' })
  date: string;

  @ApiProperty({ enum: ReservationStatus, description: 'The reservation status for the day.' })
  status: ReservationStatus;

  @ApiProperty({ type: ReservationInfoDto, nullable: true })
  reservationInfo: ReservationInfoDto | null;
}
