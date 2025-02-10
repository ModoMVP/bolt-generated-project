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
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('deals')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(
    @Body() createDealDto: CreateDealDto,
    @Req() req: Request
  ) {
    return this.dealsService.create(createDealDto, req.user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  findAll(@Req() req: Request) {
    return this.dealsService.findAll(req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  findOne(
    @Param('id') id: string, 
    @Req() req: Request
  ) {
    return this.dealsService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Param('id') id: string, 
    @Body() updateDealDto: UpdateDealDto,
    @Req() req: Request
  ) {
    return this.dealsService.update(id, updateDealDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id') id: string,
    @Req() req: Request
  ) {
    return this.dealsService.remove(id, req.user);
  }

  @Patch(':id/move-stage/:stageId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  moveToStage(
    @Param('id') id: string,
    @Param('stageId') stageId: string,
    @Req() req: Request
  ) {
    return this.dealsService.moveToStage(id, stageId, req.user);
  }
}
