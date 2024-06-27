import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import CalendarResponseDto from './dto/response/calendar.response.dto';
import ValidDateResponse from './dto/response/validDate.response.dto';

@Controller('calendar')
@ApiTags('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }

  @Get('/:year/:month')
  @HttpCode(200)
  @ApiOperation({ summary: '달 별 예약 상태 확인', description: '원하는 달의 해당하는 모든 일의 예약 상태를 확인합니다.' })
  @ApiParam({ name: 'year', description: '원하는 년도' })
  @ApiParam({ name: 'month', description: '원하는 월' })
  @ApiOkResponse({ description: '달 별 예약 상태를 성공적으로 반환한 경우', type: CalendarResponseDto, isArray: true })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async getCalendar(@Param('year') year: string, @Param('month') month: string) {
    return await this.calendarService.getDaysStatusForMonth(parseInt(year), parseInt(month));
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '예약 가능 날짜 확인', description: '이번 달에 예약할 수 있는 마지막 날짜와 현재 예약 가능 여부를 확인합니다.' })
  @ApiOkResponse({ description: '성공적으로 반환한 경우', type: ValidDateResponse })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async getValidDate() {
    const validDates = this.calendarService.getValidDate();
    return {
      isValidToday: this.calendarService.isValidToday(validDates),
      validFirstDate: validDates[0],
      validLastDate: validDates[validDates.length - 1]
    }
  }
}
