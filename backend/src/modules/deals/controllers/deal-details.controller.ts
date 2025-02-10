import { 
  Controller, 
  Get, 
  Param, 
  UseGuards,
  Req 
} from '@nestjs/common';
import { Request } from 'express';
import { DealDetailsService } from '../services/deal-details.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';

@Controller('deals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DealDetailsController {
  constructor(private dealDetailsService: DealDetailsService) {}

  @Get(':id/details')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
  async getDealDetails(
    @Param('id') dealId: string,
    @Req() req: Request
  ) {
    return this.dealDetailsService.getDealDetails(dealId, req.user);
  }
}
