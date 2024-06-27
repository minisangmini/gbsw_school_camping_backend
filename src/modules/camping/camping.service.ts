import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { Between, Repository } from 'typeorm';
import { ReservationStudentEntity } from './entities/reservation_student.entity';
import ReservationRequestDto from './dto/request/reservation.request.dto';
import * as bcrypt from 'bcrypt';
import { ReservationStatus, ReservationStatusEntity } from './entities/reservation_status.entity';
import { ValidationStudentRequestDto } from './dto/request/validationStudent.request.dto';
import { format, subDays } from 'date-fns';
import UpdateReservationDto from 'src/common/dto/updateReservation.dto';
import { BanDateEntity } from '../admin/entities/banDate.entity';
import { BlacklistEntity } from '../admin/entities/blacklist.entity';

@Injectable()
export class CampingService {
  constructor(
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(ReservationStudentEntity)
    private reservationStudentRepository: Repository<ReservationStudentEntity>,
    @InjectRepository(ReservationStatusEntity)
    private reservationStatusRepository: Repository<ReservationStatusEntity>,
    @InjectRepository(BanDateEntity)
    private banDateRepository: Repository<BanDateEntity>,
    @InjectRepository(BlacklistEntity)
    private blacklistRepository: Repository<BlacklistEntity>
  ) { }

  async isExistReservation(id: number) {
    const isExist = await this.reservationRepository.findOneBy({ id });

    if(!isExist) {
      throw new NotFoundException('예약 정보를 찾을 수 없습니다.')
    }

    return isExist;
  }

  async validateDate(date: string) {
    const isExist = await this.reservationRepository.existsBy({ reservationDate: date });
    const isValidate = await this.banDateRepository.existsBy({ date });

    if(isExist) {
      throw new ConflictException('해당 날짜는 이미 예약된 상태입니다.');
    }
    if(isValidate) {
      throw new BadRequestException('해당 날짜는 예약이 금지되어 있습니다.');
    }
  }

  async checkStudentValidation(validationStudentDto: ValidationStudentRequestDto) {
    const studentIds = validationStudentDto.studentsInfo.map(student => student.studentId);
    const uniqueStudentIds = new Set(studentIds);
    
    if(uniqueStudentIds.size !== studentIds.length) {
      throw new ConflictException('중복된 학생이 있습니다.')
    }

    const startDate = subDays(validationStudentDto.date, 30);
    const endDate = validationStudentDto.date;

    const reservations = await this.reservationRepository.find({ 
      relations: ['reservationStudents'],
      where: {
        reservationDate: Between(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')),
      },
    });

    const blacklist = await this.blacklistRepository.find();

    const isUnavailableStudent = validationStudentDto.studentsInfo.some(studentInfo => {
      return reservations.some(reservation =>
        reservation.reservationStudents.some(student => student.studentId === studentInfo.studentId) ||
        reservation.leaderId === studentInfo.studentId ||
        blacklist.some(black => black.studentId === reservation.leaderId)
      ) 
      || blacklist.some(black => black.studentId === studentInfo.studentId);
    });

    if(isUnavailableStudent) {
      throw new BadRequestException('예약이 불가능한 학생이 포함되어 있습니다.')
    }
  }

  async saveReservation(reservationInfo: ReservationRequestDto) {
    await this.validateDate(reservationInfo.reservationDate);
    const validationStudentDto: ValidationStudentRequestDto = {
      studentsInfo: [
        ...reservationInfo.students,
        reservationInfo.leader,
      ],
      date: reservationInfo.reservationDate
    };
    await this.checkStudentValidation(validationStudentDto);

    const hashedPassword = reservationInfo.password.length === 4 ? await bcrypt.hash(reservationInfo.password, 10) : reservationInfo.password;

    const reservationEntity = new ReservationEntity();
    
    reservationEntity.leaderName = reservationInfo.leader.studentName;
    reservationEntity.leaderId = reservationInfo.leader.studentId;
    reservationEntity.teacherName = reservationInfo.teacherName;
    reservationEntity.reservationDate = reservationInfo.reservationDate;
    reservationEntity.password = hashedPassword;

    const reservation = await this.reservationRepository.save(reservationEntity);

    const reservationStudentEntities = reservationInfo.students.map(student => {
      const entity = new ReservationStudentEntity();
      entity.studentName = student.studentName;
      entity.studentId = student.studentId;
      entity.reservation = reservation;

      return entity;
    });

    await this.reservationStudentRepository.save(reservationStudentEntities);

    const reservationStatusEntity = new ReservationStatusEntity();
    reservationStatusEntity.date = reservationInfo.reservationDate;
    reservationStatusEntity.status = ReservationStatus.COMPLETED;
    reservationStatusEntity.reservation = reservation;

    await this.reservationStatusRepository.save(reservationStatusEntity);
  }

  async updateReservation(updateInfo: UpdateReservationDto) {
    const reservation = await this.isExistReservation(updateInfo.id);

    await this.reservationRepository.delete({ id: updateInfo.id });
    const reservationRequestDto: ReservationRequestDto = {
      ...updateInfo,
      password: reservation.password,
    };

    try {
      await this.saveReservation(reservationRequestDto);
    } catch(err) {
      console.log(err);
      throw err;
    }
  }

  async deleteReservation(id: number) {
    await this.reservationRepository.delete({ id });
  }
}
