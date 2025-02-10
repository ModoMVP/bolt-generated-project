import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn 
} from 'typeorm';

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

export enum LogCategory {
  AUTH = 'authentication',
  USER = 'user_management',
  CLIENT = 'client',
  DEAL = 'deal',
  SYSTEM = 'system',
  SECURITY = 'security'
}

@Entity('system_logs')
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LogLevel,
    default: LogLevel.INFO
  })
  level: LogLevel;

  @Column({
    type: 'enum',
    enum: LogCategory,
    default: LogCategory.SYSTEM
  })
  category: LogCategory;

  @Column()
  message: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  tenantId?: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  timestamp: Date;
}
