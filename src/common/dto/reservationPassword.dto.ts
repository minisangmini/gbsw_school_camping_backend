import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export default class ReservationPassword {
  @ApiProperty({ description: "비밀번호", minLength: 4, maxLength: 4, example: "1234" })
  @IsString()
  @Length(4, 4)
  password: string;
}