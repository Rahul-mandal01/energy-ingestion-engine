import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TelemetryModule } from './telemetry/telemetry.module';
import { AnalyticsModule } from './analytics/analytics.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username : 'admin',
      password: 'admin',
      database: 'energy_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TelemetryModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
