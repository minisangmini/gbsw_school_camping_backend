import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from '../camping/entities/reservation.entity';
import { ReservationStatusEntity } from '../camping/entities/reservation_status.entity';
import { BlacklistEntity } from './entities/blacklist.entity';
import { AuthModule } from '../auth/auth.module';
import { BanDateEntity } from './entities/banDate.entity';
import { CampingModule } from '../camping/camping.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationEntity, ReservationStatusEntity, BlacklistEntity, BanDateEntity]),
    AuthModule,
    CampingModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
