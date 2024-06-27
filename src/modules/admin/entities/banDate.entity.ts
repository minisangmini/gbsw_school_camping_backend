import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity('ban_date')
export class BanDateEntity {
  @PrimaryColumn({ name: 'date', type: 'date', nullable: false })
  date: string;

  @Column({ name: 'reason', type: 'char', length: 20, nullable: false })
  reason: string;
}