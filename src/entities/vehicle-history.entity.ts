import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index(['vehicleId', 'timestamp'])
@Entity('vehicle_telemetry_history')
export class VehicleHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleId: string;

  @Column('float')
  soc: number;

  @Column('float')
  kwhDeliveredDc: number;

  @Column('float')
  batteryTemp: number;

  @CreateDateColumn()
  timestamp: Date;
}
