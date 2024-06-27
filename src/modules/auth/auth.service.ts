import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginReservationRequestDto } from './dto/request/loginReservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationEntity } from '../camping/entities/reservation.entity';
import { Repository } from 'typeorm';
import { CampingService } from '../camping/camping.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    @Inject(forwardRef(() => CampingService))
    private  readonly campingService: CampingService,
  ) { }

  extractJwtToken(authorizationHeader: string) {
    const token = authorizationHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('비정상적인 토큰입니다.');
    }
    
    return token;
  }

  verifyToken(token: string) {
    try {
      this.jwtService.verify(token)
    } catch(err) {
      throw new UnauthorizedException('비정상적인 토큰입니다.');
    }
  }

  async loginAdmin(password: string) {
    if (!await bcrypt.compare(password, this.configService.get<string>('ADMIN_PASSWORD'))) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.')
    }

    return this.jwtService.sign({}, { expiresIn: '3h' });
  }

  async loginReservation(loginInfo: LoginReservationRequestDto) {
    await this.campingService.isExistReservation(loginInfo.reservationId);  

    const reservation = await this.reservationRepository.findOne({
      where: { id: loginInfo.reservationId },
      relations: ['reservationStudents']
    });

    if(!await bcrypt.compare(loginInfo.password, reservation.password)) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const reservationInfo = { ...reservation };
    delete reservationInfo.password

    return reservationInfo;
  }
}
