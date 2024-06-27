import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import {
  ReservationStatus,
  ReservationStatusEntity,
} from '../camping/entities/reservation_status.entity';
import { BlacklistEntity } from './entities/blacklist.entity';
import { BanDateEntity } from './entities/banDate.entity';
import {
  BanDateRequestDto,
  BanDateResponseDto,
  BlacklistRequestDto,
  DateRequestDto,
  DeleteBlacklistRequestDto,
} from './dto';
import UpdateReservationDto from 'src/common/dto/updateReservation.dto';
import { CampingService } from '../camping/camping.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(ReservationStatusEntity)
    private reservationStatusRepository: Repository<ReservationStatusEntity>,
    @InjectRepository(BlacklistEntity)
    private blacklistRepository: Repository<BlacklistEntity>,
    @InjectRepository(BanDateEntity)
    private banDateRepository: Repository<BanDateEntity>,
    private readonly campingService: CampingService,
  ) {}

  async getReservations(year: number, month: number) {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    const reservations = await this.reservationStatusRepository.find({
      where: {
        date: Between(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
        ),
      },
      relations: ['reservation', 'reservation.reservationStudents'],
    });
    const banDates = await this.banDateRepository.find({
      where: {
        date: Between(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
        ),
      },
    });

    const datesOfMonth = eachDayOfInterval({ start: startDate, end: endDate });

    return datesOfMonth.map((date) => {
      const formattedDate = format(date, 'dd');
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
        return {
          date: formattedDate,
          status: ReservationStatus.UNAVAILABLE,
          info: null,
        };
      }
      if (
        banDates.some((banDate) => banDate.date == format(date, 'yyyy-MM-dd'))
      ) {
        return {
          date: formattedDate,
          status: ReservationStatus.UNAVAILABLE,
          info: null,
        };
      }

      const reservationForDate = reservations.find(
        (reservation) => format(reservation.date, 'dd') === formattedDate,
      );

      if (reservationForDate) {
        delete reservationForDate.reservation.password;

        return {
          date: formattedDate,
          status: reservationForDate.status,
          info: reservationForDate.reservation
            ? reservationForDate.reservation
            : null,
        };
      }

      return {
        date: formattedDate,
        status: ReservationStatus.AVAILABLE,
        info: null,
      };
    });
  }

  async getDisabledReservations(year: number, month: number) {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    const banDates = await this.banDateRepository.find({
      where: {
        date: Between(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
        ),
      },
      order: { date: 'ASC' },
    });

    if (banDates.length < 1) {
      return [];
    }

    const result: BanDateResponseDto[] = [];

    result.push({
      startDate: banDates[0].date,
      endDate: banDates[0].date,
      reason: banDates[0].reason,
    });

    let idx = 0;

    banDates.forEach((data, index) => {
      if (index === 0) return;

      if (result[idx].reason === data.reason) {
        result[idx].endDate = data.date;
      } else {
        result.push({
          startDate: data.date,
          endDate: data.date,
          reason: data.reason,
        });
        idx++;
      }
    });

    return result;
  }

  async disableReservations(banDatesRequestDto: BanDateRequestDto[]) {
    const datesToDisable = banDatesRequestDto.map((dto) => dto.date);

    const existingBanDates = await this.banDateRepository.find({
      where: { date: In(datesToDisable) },
    });

    if (existingBanDates.length > 0) {
      throw new ConflictException();
    }

    await this.banDateRepository.save(banDatesRequestDto);
  }

  async enableReservations(datesRequestDto: DateRequestDto[]) {
    const dates = datesRequestDto.map((dto) => dto.date);
    await this.banDateRepository.delete({ date: In(dates) });
  }

  async isExistBlacklist(studentId: string) {
    const isExist = await this.blacklistRepository.existsBy({ studentId });

    if (isExist) {
      throw new ConflictException('이미 블랙된 학생입니다.');
    }
  }

  async getBlaclist() {
    return await this.blacklistRepository.find();
  }

  async saveBlacklist(blacklistRequestDto: BlacklistRequestDto) {
    await this.isExistBlacklist(blacklistRequestDto.studentId);

    const blacklistEntity = new BlacklistEntity();
    blacklistEntity.studentId = blacklistRequestDto.studentId;
    blacklistEntity.studentName = blacklistRequestDto.studentName;
    blacklistEntity.reason = blacklistRequestDto.reason;

    return await this.blacklistRepository.save(blacklistEntity);
  }

  async deleteBlacklist(deleteBlacklistRequestDto: DeleteBlacklistRequestDto) {
    await this.blacklistRepository.delete({
      studentId: deleteBlacklistRequestDto.studentId,
    });
  }

  async updateReservation(updateReservationDto: UpdateReservationDto) {
    await this.campingService.updateReservation(updateReservationDto);
  }

  async deleteReservation(id: number) {
    await this.campingService.deleteReservation(id);
  }

  async createExcel(year: number, month: number) {
    const data = await this.getReservations(year, month);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('달력');

    sheet.addRow(['일', '월', '화', '수', '목', '금']);

    let currentRow = sheet.lastRow;
    currentRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6AA84F' },
      };
      cell.font = { bold: true, size: 13 };
      cell.alignment = { horizontal: 'right' };
    });

    let row = [];
    let dateRow = [];
    data.forEach((item, index) => {
      let displayText = item.status === '예약 불가능' ? 'X' : 'O';

      row.push(displayText);
      dateRow.push(index + 1);

      if ((index + 1) % 6 === 0) {
        sheet.addRow(dateRow);
        sheet.addRow(row);
        row = [];
        dateRow = [];
      }
    });

    if (row.length > 0) {
      sheet.addRow(row);
    }

    data.forEach((item, index) => {
      if (item.status === '예약 완료' && item.info) {
        const rowNumber = Math.floor(index / 6) + 2;
        const columnNumber = (index % 6) + 1;
        const cell = sheet.getRow(rowNumber).getCell(columnNumber);

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF3F3F3' },
        };
        cell.value = item.info.teacherName;
        cell.alignment = { vertical: 'top', wrapText: true };

        const studentNames =
          item.info.leaderName +
          '\n' +
          item.info.reservationStudents.map((st) => st.studentName).join('\n');
        sheet.insertRow(rowNumber + 1, ['', '', '', '', '', '']);
        sheet.getRow(rowNumber + 1).getCell(columnNumber).value = studentNames;
      }
    });

    return await workbook.xlsx.writeBuffer();
  }

  async createEx1cel(year: number, month: number) {
    const data = await this.getReservations(year, month);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('달력');

    sheet.addRow(['일', '월', '화', '수', '목', '금']);

    let currentRow = sheet.lastRow;
    currentRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6AA84F' },
      };
      cell.font = { bold: true, size: 13 };
      cell.alignment = { horizontal: 'right' };
    });

    let row = [];
    console.log(data);
    data.forEach((item, index) => {
      let displayText = item.status === '예약 불가능' ? 'X' : 'O';

      if (item.status === '예약 완료' && item.info) {
        displayText = item.info.teacherName;
      }

      row.push([displayText]);

      if ((index + 1) % 6 === 0) {
        sheet.addRow(row);
        row = [];
      }
    });

    if (row.length > 0) {
      sheet.addRow(row);
    }

    data.forEach((item, index) => {
      if (item.status === '예약 완료' && item.info) {
        const rowNumber = Math.floor(index / 6) + 2;
        const columnNumber = (index % 6) + 1;
        const cell = sheet.getRow(rowNumber).getCell(columnNumber);

        cell.value =
          `${item.info.teacherName} 선생님\n` +
          item.info.reservationStudents.map((st) => st.studentName).join('\n');
        cell.alignment = { vertical: 'top' };
      }
    });

    return await workbook.xlsx.writeBuffer();
  }
}
