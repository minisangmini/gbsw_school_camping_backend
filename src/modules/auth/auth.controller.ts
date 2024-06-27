import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAdminRequesDto } from './dto/request/loginAdmin.request.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginReservationRequestDto } from './dto/request/loginReservation.dto';
import ReservationInfoDto from 'src/common/dto/reservation.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/admin')
  @ApiOperation({ summary: '어드민 로그인', description: '어드민 로그인을 진행합니다.' })
  @ApiBody({ type: LoginAdminRequesDto })
  @ApiOkResponse({ description: 'jwt(3h) 토큰을 반환합니다.' })
  @ApiUnauthorizedResponse({ description: '비밀번호가 일치하지 않습니다.' })
  @ApiTooManyRequestsResponse({ description: '로그인 시도를 많이 한 경우' })
  async loginAdmin(@Body() loginAdminRequesDto: LoginAdminRequesDto) {
    return await this.authService.loginAdmin(loginAdminRequesDto.password);
  }

  @Post('/login/reservation')
  @ApiOperation({ summary: '예약 신청 로그인', description: '신청한 예약에 대한 로그인을 진행합니다.' })
  @ApiBody({ type: LoginReservationRequestDto })
  @ApiOkResponse({ type: ReservationInfoDto, description: '예약 정보를 반환홥니다.' })
  @ApiUnauthorizedResponse({ description: '비밀번호가 일치하지 않습니다.' })
  @ApiTooManyRequestsResponse({ description: '로그인 시도를 많이 한 경우' })
  async loginReservation(@Body() loginReservationRequestDto: LoginReservationRequestDto) {
    return await this.authService.loginReservation(loginReservationRequestDto);
  }
}
