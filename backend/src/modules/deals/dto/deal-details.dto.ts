import { Deal, DealPriority, DealStatus } from '../entities/deal.entity';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../auth/entities/user.entity';
import { SalesFunnelStage } from '../../sales-funnel/entities/sales-funnel-stage.entity';
import { DealInteraction } from '../entities/deal-interaction.entity';
import { Task } from '../../tasks/entities/task.entity';

export class DealDetailsDto {
  id: string;
  title: string;
  value?: number;
  priority: DealPriority;
  status: DealStatus;
  expectedClosingDate?: Date;
  description?: string;
  additionalInfo?: Record<string, any>;
  
  client?: Client;
  stage?: SalesFunnelStage;
  responsible?: User;
  
  interactions?: DealInteraction[];
  tasks?: Task[];

  static fromEntity(deal: Deal): DealDetailsDto {
    return {
      id: deal.id,
      title: deal.title,
      value: deal.value,
      priority: deal.priority,
      status: deal.status,
      expectedClosingDate: deal.expectedClosingDate,
      description: deal.description,
      additionalInfo: deal.additionalInfo,
      client: deal.client,
      stage: deal.stage,
      responsible: deal.responsible,
      interactions: deal.interactions,
      tasks: deal.tasks
    };
  }
}
