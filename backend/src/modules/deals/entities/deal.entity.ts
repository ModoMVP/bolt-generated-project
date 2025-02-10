import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Tenant } from '../../auth/entities/tenant.entity';
import { Client } from '../../clients/entities/client.entity';
import { SalesFunnelStage } from '../../sales-funnel/entities/sales-funnel-stage.entity';
import { User } from '../../auth/entities/user.entity';
import { DealInteraction } from './deal-interaction.entity';
import { Task } from '../../tasks/entities/task.entity';

export enum DealPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum DealStatus {
  OPEN = 'open',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost'
}

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value?: number;

  @Column({
    type: 'enum',
    enum: DealPriority,
    default: DealPriority.MEDIUM
  })
  priority: DealPriority;

  @Column({
    type: 'enum',
    enum: DealStatus,
    default: DealStatus.OPEN
  })
  status: DealStatus;

  @Column({ type: 'date', nullable: true })
  expectedClosingDate?: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('jsonb', { nullable: true })
  additionalInfo?: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tenant, tenant => tenant.id)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client?: Client;

  @Column({ nullable: true })
  clientId?: string;

  @ManyToOne(() => SalesFunnelStage, { nullable: true })
  @JoinColumn({ name: 'stageId' })
  stage?: SalesFunnelStage;

  @Column({ nullable: true })
  stageId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'responsibleId' })
  responsible?: User;

  @Column({ nullable: true })
  responsibleId?: string;

  @OneToMany(() => DealInteraction, interaction => interaction.deal)
  interactions?: DealInteraction[];

  @OneToMany(() => Task, task => task.deal)
  tasks?: Task[];
}
