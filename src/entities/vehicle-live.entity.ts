import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('vehicle_live_status')
export class VehicleLive {
  @PrimaryColumn()
  vehicleId: string;

  @Column('float')
  soc: number;

  @Column('float')
  batteryTemp: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
