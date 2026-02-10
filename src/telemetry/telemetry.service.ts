import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MeterHistory } from "src/entities/meter-history.entity";
import { VehicleLive } from "src/entities/vehicle-live.entity";
import { VehicleHistory } from "src/entities/vehicle-history.entity";
import { Repository } from "typeorm/browser/repository/Repository.js";

@Injectable()
export class TelemetryService{
    constructor(
        @InjectRepository(MeterHistory)
        private meterRepo: Repository<MeterHistory>,

        @InjectRepository(VehicleHistory)
        private vehicleRepo: Repository<VehicleHistory>,

        @InjectRepository(VehicleLive)
        private vehicleLiveRepo: Repository<VehicleLive>,
    ){}

    async ingest(payload: any){
        if(payload.meterId){
            await this.meterRepo.save(payload);
            return { status: 'meter data ingested' };

            if(payload.vehicleId){
                await this.vehicleRepo.save(payload);

                await this.vehicleLiveRepo.save({
                    vehicleId: payload.vehicleId,
                    soc: payload.soc,
                    batteryTemp: payload.batteryTemp,
                })

                return { status: 'vehicle data ingested'};
            }

            return {error: 'invalid payload'};
        }
    }
}