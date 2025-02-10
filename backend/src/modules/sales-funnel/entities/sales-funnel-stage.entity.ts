import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { SalesFunnel } from './sales-funnel.entity';

export enum StageColor {
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  RED = 'red'
}

@Entity('sales_funnel_stages')
export class SalesFunnelStage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: StageColor,
    default: StageColor.BLUE
  })
  color: StageColor;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => SalesFunnel, funnel => funnel.stages)
  @JoinColumn({ name: 'funnelId' })
  funnel: SalesFunnel;

  @Column()
  funnelId: string;
}
