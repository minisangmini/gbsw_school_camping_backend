import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReservationEntity } from "./reservation.entity";

export enum ReservationStatus {
  AVAILABLE = '예약 가능',
  COMPLETED = '예약 완료',
  UNAVAILABLE = '예약 불가능',
}

@Entity('reservation_status')
export class ReservationStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'date', type: 'date', nullable: false })
  date: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.AVAILABLE
  })
  status: ReservationStatus;

  @ManyToOne(() => ReservationEntity, reservation => reservation.reservationStudents, { nullable: true, onDelete: 'CASCADE' })
  reservation: ReservationEntity;
}
