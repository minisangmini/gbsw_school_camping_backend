import { Module, forwardRef } from '@nestjs/common';
import { CampingService } from './camping.service';
import { CampingController } from './camping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationStudentEntity } from './entities/reservation_student.entity';
import { ReservationStatusEntity } from './entities/reservation_status.entity';
import { BanDateEntity } from '../admin/entities/banDate.entity';
import { BlacklistEntity } from '../admin/entities/blacklist.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationEntity, ReservationStudentEntity, ReservationStatusEntity, BanDateEntity, BlacklistEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CampingController],
  providers: [CampingService],
  exports: [CampingService]
})
export class CampingModule {}
