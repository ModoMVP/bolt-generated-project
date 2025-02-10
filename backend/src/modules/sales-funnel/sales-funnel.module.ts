import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesFunnelService } from './sales-funnel.service';
import { SalesFunnelController } from './sales-funnel.controller';
import { SalesFunnel } from './entities/sales-funnel.entity';
import { SalesFunnelStage } from './entities/sales-funnel-stage.entity';
import { Tenant } from '../auth/entities/tenant.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesFunnel, SalesFunnelStage, Tenant]),
    AuthModule
  ],
  controllers: [SalesFunnelController],
  providers: [SalesFunnelService],
  exports: [SalesFunnelService]
})
export class SalesFunnelModule {}
