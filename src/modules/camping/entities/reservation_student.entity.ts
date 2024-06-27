import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReservationEntity } from "./reservation.entity";


@Entity('reservation_student')
export class ReservationStudentEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'student_name', type: 'char', length: 4, nullable: false })
  studentName: string;

  @Column({ name: 'student_id', type: 'char', length: 4, nullable: false })
  studentId: string;

  @ManyToOne(() => ReservationEntity, reservation => reservation.reservationStudents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservationId' })
  reservation: ReservationEntity;
}