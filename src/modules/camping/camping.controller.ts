import { Body, Controller, Delete, HttpCode, Inject, Param, Post, Put, forwardRef } from '@nestjs/common';
import { CampingService } from './camping.service';
import ReservationRequestDto from './dto/request/reservation.request.dto';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ValidationStudentRequestDto } from './dto/request/validationStudent.request.dto';
import UpdateReservationDto from 'src/common/dto/updateReservation.dto';
import UserUpdateReservationRequestDto from './dto/request/userUpdateReservation.request.dto';
import { AuthService } from '../auth/auth.service';
import { LoginReservationRequestDto } from '../auth/dto/request/loginReservation.dto';
import ReservationPassword from 'src/common/dto/reservationPassword.dto';

@ApiTags('camping')
@Controller('camping')
export class CampingController {
  constructor(
    private readonly campingService: CampingService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Post('/validate/student')
  @HttpCode(200)
  @ApiOperation({ summary: '학생들 예약 가능 여부', description: '학생들의 예약 가능 여부를 확인합니다' })
  @ApiBody({ type: ValidationStudentRequestDto })
  @ApiOkResponse({ description: '예약이 가능한 경우' })
  @ApiConflictResponse({ description: '중복된 학생이 있습니다.' })
  @ApiBadRequestResponse({ description: '예약이 불가능한 학생이 포함되어 있습니다.' })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async validateStudent(@Body() validationStudentDto: ValidationStudentRequestDto) {
    await this.campingService.checkStudentValidation(validationStudentDto);
  }

  @Post()
  @ApiOperation({ summary: '예약하기', description: '스쿨캠핑 예약을 합니다.' })
  @ApiBody({ type: ReservationRequestDto })
  @ApiCreatedResponse({ description: '스쿨캠핑 예약을 성공한 경우' })
  @ApiConflictResponse({
    content: {
      'application/json': {
        examples: {
          '이미 예약된 날짜': { description: '해당 날짜는 이미 예약된 상태입니다.' },
          '중복된 학생': { description: '중복된 학생이 있습니다.' }
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: '해당 날짜는 예약이 금지되어 있습니다.' })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async reserveCamping(@Body() reservationRequestDto: ReservationRequestDto) {
    await this.campingService.saveReservation(reservationRequestDto);
  }

  @Put()
  @ApiOperation({ summary: '예약 정보 수정', description: '예약 정보를 수정합니다.' })
  @ApiBody({ type: UserUpdateReservationRequestDto, description: '업데이트할 예약 정보' })
  @ApiOkResponse({ description: '예약에 성공한 경우', type: UserUpdateReservationRequestDto })
  @ApiUnauthorizedResponse({ description: '비밀번호가 일치하지 않습니다.' })
  @ApiNotFoundResponse({ description: '예약 정보를 찾을 수 없습니다.' })
  @ApiConflictResponse({ description: '중복된 학생이 있습니다.' })
  @ApiBadRequestResponse({ description: '예약이 불가능한 학생이 포함되어 있습니다.' })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async updateReservation(@Body() userUpdateReservationDto: UserUpdateReservationRequestDto) {
    const loginReservation: LoginReservationRequestDto = {
      reservationId: userUpdateReservationDto.id,
      password: userUpdateReservationDto.password
    };
    await this.authService.loginReservation(loginReservation);

    const updateReservationDto: UpdateReservationDto = {
      ...userUpdateReservationDto
    }
    return await this.campingService.updateReservation(updateReservationDto)
  }

  @Delete('/:id')
  @ApiOperation({ summary: '예약 삭제', description: '예약을 삭제합니다.' })
  @ApiParam({ name: 'id', description: '삭제할 예약 id ', example: 1 })
  @ApiBody({ type: ReservationPassword, description: '삭제할 예약의 비밀번호' })
  @ApiUnauthorizedResponse({ description: '비밀번호가 일치하지 않습니다.' })
  @ApiNoContentResponse({ description: '예약이 성공적으로 삭제된 경우' })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async deleteReservation(@Param('id') id: string, @Body() reservationPassword: ReservationPassword) {
    const loginReservation: LoginReservationRequestDto = {
      reservationId: parseInt(id),
      password: reservationPassword.password
    };
    await this.authService.loginReservation(loginReservation);

    await this.campingService.deleteReservation(parseInt(id));
  }
}
