import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsString } from 'class-validator';

export class LoginAdminRequesDto {
  @ApiProperty({ description: "비밀번호", example: 'abcd1234' })
  @IsString()
  password: string;
}