import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import {
  BanDateRequestDto,
  BlacklistRequestDto,
  DeleteBlacklistRequestDto,
  BlacklistResponseDto,
  DateRequestDto,
  ReservationResponseDto,
  BanDateResponseDto,
} from './dto';
import UpdateReservationDto from 'src/common/dto/updateReservation.dto';


@Controller('admin')
@UseGuards(AdminAuthGuard)
@ApiTags('admin')
@ApiBearerAuth('access-token')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/reservation/:year/:month')
  @ApiOperation({ summary: '달 별 예약 상태 확인', description: '년/달에 해당하는 예약 상태(정보)를 확인합니다.' })
  @ApiParam({ name: 'year', description: '원하는 년도' })
  @ApiParam({ name: 'month', description: '원하는 월' })
  @ApiOkResponse({ description: '달 별 예약 상태를 성공적으로 반환한 경우', type: ReservationResponseDto, isArray: true })
  async getReservationList(@Param('year') year: string, @Param('month') month: string) {
    return await this.adminService.getReservations(parseInt(year), parseInt(month));
  }

  @Get('/reservation/disable/:year/:month')
  @ApiOperation({ summary: '예약 신청 금지 리스트', description: '예약 신청 금지 당한 날짜를 확인합니다.' })
  @ApiParam({ name: 'year', description: '원하는 년도' })
  @ApiParam({ name: 'month', description: '원하는 월' })
  @ApiOkResponse({ description: '예약 신청 금지 리스트 확인에 성공한 경우', type: BanDateResponseDto, isArray: true })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async getDisabledReservation(@Param('year') year: string, @Param('month') month: string) {
    return await this.adminService.getDisabledReservations(parseInt(year), parseInt(month));
  }

  @Post('/reservation/disable')
  @HttpCode(200)
  @ApiOperation({ summary: '예약 신청 금지', description: '해당하는 날짜를 예약 하지 못 하게 합니다.' })
  @ApiBody({ type: BanDateRequestDto, isArray: true, description: '금지할 날짜와 이유' })
  @ApiOkResponse({ description: '예약 신청 금지를 성공적으로 한 경우' })
  @ApiConflictResponse({ description: '이미 예약 신청이 금지된 날짜인 경우' })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async disableReservationForDate(@Body() banDatesRequestDto: BanDateRequestDto[]) {
    await this.adminService.disableReservations(banDatesRequestDto);
  }

  @Post('/reservation/enable')
  @HttpCode(200)
  @ApiOperation({ summary: '예약 신청 금지 해제', description: '해당하는 날짜를 예약 할 수 있게 합니다.' })
  @ApiBody({ type: DateRequestDto, isArray: true, description: '금지 해제할 날짜' })
  @ApiOkResponse({ description: '예약 신청 금지 해제를 성공적으로 한 경우' })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async enableReservationForDate(@Body() datesRequestDto: DateRequestDto[]) {
    await this.adminService.enableReservations(datesRequestDto)
  }

  @Get('/blacklist')
  @ApiOperation({ summary: '블랙리스트 확인', description: '블랙리스트 된 학생을 확인합니다.' })
  @ApiOkResponse({ description: '블랙리스트를 성공적으로 반환한 경우', type: BlacklistResponseDto, isArray: true })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async getBlacklist() {
    return await this.adminService.getBlaclist();
  }

  @Post('/blacklist')
  @ApiOperation({ summary: '블랙리스트 추가', description: '블랙리스트에 학생을 추가합니다.' })
  @ApiBody({ description: '추가할 학생의 정보', type: BlacklistRequestDto })
  @ApiOkResponse({ description: '블랙리스트에 성공적으로 추가한 경우', type: BlacklistResponseDto })
  @ApiConflictResponse({ description: '이미 블랙된 학생입니다.' })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async addBlacklist(@Body() blacklistRequestDto: BlacklistRequestDto) {
    await this.adminService.saveBlacklist(blacklistRequestDto);
  }

  @Delete('/blacklist')
  @ApiOperation({ summary: '블랙리스트 삭제', description: '블랙리스트에 학생을 삭제합니다.' })
  @ApiBody({ description: '삭제할 학생의 정보', type: DeleteBlacklistRequestDto })
  @ApiNoContentResponse({ description: '블랙리스트에 성공적으로 삭제된 경우' })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async deleteBlacklist(@Body() deleteBlacklistRequestDto: DeleteBlacklistRequestDto) {
    await this.adminService.deleteBlacklist(deleteBlacklistRequestDto);
  }

  @Put('/reservation')
  @ApiOperation({ summary: '예약 정보 수정', description: '예약 정보를 수정합니다.' })
  @ApiBody({ type: UpdateReservationDto, description: '업데이트할 예약 정보' })
  @ApiOkResponse({ description: '예약에 성공한 경우', type: UpdateReservationDto })
  @ApiNotFoundResponse({ description: '예약 정보를 찾을 수 없습니다.' })
  @ApiConflictResponse({ description: '중복된 학생이 있습니다.' })
  @ApiBadRequestResponse({ description: '예약이 불가능한 학생이 포함되어 있습니다.' })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async updateReservation(@Body() updateReservationDto: UpdateReservationDto) {
    return await this.adminService.updateReservation(updateReservationDto)
  }

  @Delete('/reservation/:id')
  @ApiOperation({ summary: '예약 삭제', description: '예약을 삭제합니다.' })
  @ApiParam({ name: 'id', description: '삭제할 예약 id ', example: 1 })
  @ApiNoContentResponse({ description: '예약이 성공적으로 삭제된 경우' })
  @ApiInternalServerErrorResponse({ description: '서버 오류' })
  async deleteReservation(@Param('id') id: string) {
    await this.adminService.deleteReservation(parseInt(id));
  }

  @Get('/excel/:year/:month')
  @ApiOperation({ summary: '엑셀 추출', description: '년/월에 해당하는 예약 현황을 엑셀로 추출합니다' })
  @ApiParam({ name: 'year', description: '원하는 년도' })
  @ApiParam({ name: 'month', description: '원하는 월' })
  @ApiOkResponse({ 
    description: '엑셀 파일을 성공적으로 반환한 경우', 
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary'
        }
      }
    }
   })
  async downloadExcel(@Res() res: Response, @Param('year') year: string, @Param('month') month: string) {
    const excelBuffer = await this.adminService.createExcel(parseInt(year), parseInt(month));

    const fileName = `스쿨캠핑_명단_${year}-${month}.xlsx`;
    const encodedFileName = encodeURIComponent(fileName);

    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.header('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);

    res.send(excelBuffer);
  }
}