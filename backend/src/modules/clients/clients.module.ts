import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';
import { Tenant } from '../auth/entities/tenant.entity';
import { AuthModule } from '../auth/auth.module';
import { CompanyWebhookService } from './services/company-webhook.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Tenant]),
    AuthModule,
    HttpModule
  ],
  controllers: [ClientsController],
  providers: [ClientsService, CompanyWebhookService],
  exports: [ClientsService, CompanyWebhookService]
})
export class ClientsModule {}
