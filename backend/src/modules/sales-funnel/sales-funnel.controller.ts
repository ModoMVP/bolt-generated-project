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
import { SalesFunnelService } from './sales-funnel.service';
import { CreateSalesFunnelDto } from './dto/create-sales-funnel.dto';
import { UpdateSalesFunnelDto } from './dto/update-sales-funnel.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('sales-funnel')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class SalesFunnelController {
  constructor(private readonly salesFunnelService: SalesFunnelService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(
    @Body() createSalesFunnelDto: CreateSalesFunnelDto,
    @Req() req: Request
  ) {
    return this.salesFunnelService.create(createSalesFunnelDto, req.user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  findAll(@Req() req: Request) {
    return this.salesFunnelService.findAll(req.user);
  }

  @Get('default')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  getDefaultFunnel(@Req() req: Request) {
    return this.salesFunnelService.getDefaultFunnel(req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  findOne(
    @Param('id') id: string, 
    @Req() req: Request
  ) {
    return this.salesFunnelService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Param('id') id: string, 
    @Body() updateSalesFunnelDto: UpdateSalesFunnelDto,
    @Req() req: Request
  ) {
    return this.salesFunnelService.update(id, updateSalesFunnelDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id') id: string,
    @Req() req: Request
  ) {
    return this.salesFunnelService.remove(id, req.user);
  }
}
