import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  Notification, 
  NotificationType, 
  NotificationStatus 
} from '../entities/notification.entity';
import { User } from '../../modules/auth/entities/user.entity';
import { Tenant } from '../../modules/auth/entities/tenant.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>
  ) {}

  async createNotification(
    recipient: User,
    tenant: Tenant,
    data: {
      title: string;
      content: string;
      type?: NotificationType;
      actionUrl?: string;
    }
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...data,
      type: data.type || NotificationType.SYSTEM,
      recipient,
      tenant,
      status: NotificationStatus.UNREAD
    });

    return this.notificationRepository.save(notification);
  }

  async getUserNotifications(
    userId: string, 
    status?: NotificationStatus
  ): Promise<Notification[]> {
    const where: any = { recipientId: userId };
    
    if (status) {
      where.status = status;
    }

    return this.notificationRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 50
    });
  }

  async markNotificationAsRead(
    notificationId: string, 
    userId: string
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { 
        id: notificationId, 
        recipientId: userId 
      }
    });

    if (!notification) {
      throw new Error('Notificação não encontrada');
    }

    notification.status = NotificationStatus.READ;
    return this.notificationRepository.save(notification);
  }

  async clearNotifications(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { recipientId: userId },
      { status: NotificationStatus.ARCHIVED }
    );
  }
}
