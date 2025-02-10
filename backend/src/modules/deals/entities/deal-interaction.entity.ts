import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Deal } from './deal.entity';
import { User } from '../../auth/entities/user.entity';

export enum InteractionType {
  NOTE = 'note',
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting'
}

@Entity('deal_interactions')
export class DealInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: InteractionType,
    default: InteractionType.NOTE
  })
  type: InteractionType;

  @ManyToOne(() => Deal, deal => deal.interactions)
  @JoinColumn({ name: 'dealId' })
  deal: Deal;

  @Column()
  dealId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
