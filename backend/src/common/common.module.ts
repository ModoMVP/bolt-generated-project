import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLog } from './entities/system-log.entity';
import { Notification } from './entities/notification.entity';
import { LoggerService } from './services/logger.service';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SystemLog, 
      Notification
    ])
  ],
  controllers: [NotificationController],
  providers: [
    LoggerService, 
    NotificationService
  ],
  exports: [
    LoggerService, 
    NotificationService
  ]
})
export class CommonModule {}
