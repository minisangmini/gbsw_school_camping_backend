import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import {
  ReservationStatus,
  ReservationStatusEntity,
} from '../camping/entities/reservation_status.entity';
import { BanDateEntity } from '../admin/entities/banDate.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(ReservationStatusEntity)
    private reservationStatusRepository: Repository<ReservationStatusEntity>,
    @InjectRepository(BanDateEntity)
    private banDateRepository: Repository<BanDateEntity>,
  ) {}

  async getDaysStatusForMonth(year: number, month: number) {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));
    const reservations = await this.reservationStatusRepository.find({
      where: {
        date: Between(
          format(startDate, 'yyyy-MM-dd'),
          format(endDate, 'yyyy-MM-dd'),
        ),
      },
      relations: ['reservation'],
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
        return { date: formattedDate, status: ReservationStatus.UNAVAILABLE };
      }
      if (
        banDates.some((banDate) => banDate.date == format(date, 'yyyy-MM-dd'))
      ) {
        return { date: formattedDate, status: ReservationStatus.UNAVAILABLE };
      }
      
      const reservation = reservations.find(
        (reservation) => format(reservation.date, 'dd') === formattedDate,
      );

      const status = reservation
        ? reservation.status
        : ReservationStatus.AVAILABLE;

      if (status === ReservationStatus.COMPLETED) {
        return { date: formattedDate, status, id: reservation.reservation.id };
      }

      return { date: formattedDate, status };
    });
  }

  isValidToday(dateArray: string[]) {
    const today = moment.tz(Date.now(), "Asia/Seoul").format('YYYY-MM-DD');

    const formattedDateArray = dateArray.map(d => moment(d).format('YYYY-MM-DD'));
  
    return formattedDateArray.includes(today);
  }

  getValidDate() {
    const koreaTime = moment.tz(Date.now(), 'Asia/Seoul');
    const lastDayOfMonth = koreaTime.endOf('month');

    let lastMonday = lastDayOfMonth.startOf('isoWeek');

    if (lastMonday.clone().add(4, 'days').month() !== lastDayOfMonth.month()) {
      lastMonday = lastMonday.subtract(1, 'week');
    }

    let weekdays = [];
    for (let day = 0; day <= 4; day++) {
      weekdays.push(lastMonday.clone().add(day, 'days').format('YYYY-MM-DD'));
    }

    return weekdays;
  }
}
