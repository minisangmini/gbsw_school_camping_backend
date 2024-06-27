import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";
import UpdateReservationDto from "src/common/dto/updateReservation.dto";

export default class UserUpdateReservationRequestDto extends UpdateReservationDto {
  @ApiProperty({ description: "비밀번호", minLength: 4, maxLength: 4, example: "1234" })
  @IsString()
  @Length(4, 4)
  password: string;
}