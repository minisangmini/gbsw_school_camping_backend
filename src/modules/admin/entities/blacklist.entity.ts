import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity('blacklist')
export class BlacklistEntity {
  @PrimaryColumn({ name: 'student_id', type: 'char', length: 4, nullable: false })
  studentId: string;
  
  @Column({ name: 'student_name', type: 'char', length: 4, nullable: false })
  studentName: string;

  @Column({ name: 'reason', type: 'char', length: 20, nullable: false })
  reason: string;
}