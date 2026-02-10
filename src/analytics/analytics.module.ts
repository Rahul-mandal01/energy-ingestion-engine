import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { MeterHistory } from '../entities/meter-history.entity';
import { VehicleHistory } from '../entities/vehicle-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeterHistory, VehicleHistory])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
