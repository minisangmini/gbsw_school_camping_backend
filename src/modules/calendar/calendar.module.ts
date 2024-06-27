import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationStatusEntity } from '../camping/entities/reservation_status.entity';
import { BanDateEntity } from '../admin/entities/banDate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationStatusEntity, BanDateEntity])
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
