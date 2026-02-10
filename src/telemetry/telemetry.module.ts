import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { MeterHistory } from '../entities/meter-history.entity';
import { VehicleHistory } from '../entities/vehicle-history.entity';
import { VehicleLive } from '../entities/vehicle-live.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeterHistory,
      VehicleHistory,
      VehicleLive,
    ]),
  ],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}
