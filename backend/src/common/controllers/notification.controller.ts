import { 
  Controller, 
  Get, 
  Param, 
  Patch, 
  Delete, 
  UseGuards,
  Req 
} from '@nestjs/common';
import { Request } from 'express';
import { NotificationService } from '../services/notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NotificationStatus } from '../entities/notification.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(@Req() req: Request) {
    return this.notificationService.getUserNotifications(req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') notificationId: string,
    @Req() req: Request
  ) {
    return this.notificationService.markNotificationAsRead(
      notificationId, 
      req.user.id
    );
  }

  @Delete('clear')
  async clearNotifications(@Req() req: Request) {
    return this.notificationService.clearNotifications(req.user.id);
  }
}
