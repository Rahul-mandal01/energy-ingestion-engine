import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeterHistory } from 'src/entities/meter-history.entity';
import { VehicleHistory } from 'src/entities/vehicle-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(MeterHistory)
    private meterRepo: Repository<MeterHistory>,
    @InjectRepository(VehicleHistory)
    private vehicleRepo: Repository<VehicleHistory>,
  ) {}

  async getPerformance(vehicleId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const dc = await this.vehicleRepo
      .createQueryBuilder()
      .select('SUM(kwhDeliveredDc)', 'totalDc')
      .addSelect('AVG(batteryTemp)', 'avgTemp')
      .where('vehicleId = :vehicleId', { vehicleId })
      .andWhere('timestamp >= :since, {since}')
      .getRawOne();

    const ac = await this.meterRepo
      .createQueryBuilder()
      .select('SUM(kwhConsumedAc)', 'totalAc')
      .where('timestamp >= :since', { since })
      .getRawOne();

    return {
      totalAc: Number(ac.totalAc || 0),
      totalDc: Number(dc.totalDc || 0),
      efficiency: dc.totalDc / ac.totalAc || 0,
      avgBatteryTemp: Number(dc.avgTemp || 0),
    };
  }
}
