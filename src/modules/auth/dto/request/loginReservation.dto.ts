import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginReservationRequestDto {
  @ApiProperty({ description: '예약 id', example: 1 })
  @IsNumber()
  reservationId: number;

  @ApiProperty({ description: "비밀번호", example: '1234' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  password: string;
}