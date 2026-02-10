import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Index } from 'typeorm/browser';

@Index(['meterId', 'timestamp'])
@Entity('meter_telemetry_history')
export class MeterHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  meterId: string;

  @Column('float')
  kwhConsumedAc: number;

  @Column('float')
  voltage: number;

  @CreateDateColumn()
  timestamp: Date;
}
