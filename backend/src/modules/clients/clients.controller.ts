import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { ClientsService } from './clients.service';
import { CompanyWebhookService } from './services/company-webhook.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly companyWebhookService: CompanyWebhookService
  ) {}

  // Métodos anteriores mantidos...

  @Get('company-details/:cnpj')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getCompanyDetails(@Param('cnpj') cnpj: string) {
    return this.companyWebhookService.fetchCompanyDetails(cnpj);
  }
}
