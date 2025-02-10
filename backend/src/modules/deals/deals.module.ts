import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { DealDetailsService } from './services/deal-details.service';
import { DealDetailsController } from './controllers/deal-details.controller';
import { Deal } from './entities/deal.entity';
import { DealInteraction } from './entities/deal-interaction.entity';
import { Tenant } from '../auth/entities/tenant.entity';
import { Client } from '../clients/entities/client.entity';
import { SalesFunnelStage } from '../sales-funnel/entities/sales-funnel-stage.entity';
import { User } from '../auth/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Deal, 
      DealInteraction,
      Tenant, 
      Client, 
      SalesFunnelStage, 
      User
    ]),
    AuthModule
  ],
  controllers: [
    DealsController, 
    DealDetailsController
  ],
  providers: [
    DealsService, 
    DealDetailsService
  ],
  exports: [DealsService, DealDetailsService]
})
export class DealsModule {}
