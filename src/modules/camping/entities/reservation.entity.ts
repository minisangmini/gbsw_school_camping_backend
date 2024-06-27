import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Repository, getRepository } from "typeorm";
import { ReservationStudentEntity } from "./reservation_student.entity";
import { ReservationStatusEntity } from "./reservation_status.entity";


@Entity('reservation')
export class ReservationEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  
  @Column({ name: 'leader_name', type: 'char', length: 4, nullable: false })
  leaderName: string;

  @Column({ name: 'leader_id', type: 'char', length: 4, nullable: false })
  leaderId: string;

  @Column({ name: 'teacher_name', type: 'char', length: 4, nullable: false })
  teacherName: string;

  @Column({ name: 'date', type: 'date', nullable: false })
  reservationDate: string;

  @Column({ name: 'password', type: 'char', length: 60, nullable: false })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ReservationStudentEntity, reservationStudent => reservationStudent.reservation, { cascade: true })
  reservationStudents: ReservationStudentEntity[];

  @OneToMany(() => ReservationStatusEntity, reservationStatus => reservationStatus.reservation, { cascade: true })
  reservationStatus: ReservationStatusEntity[]
}