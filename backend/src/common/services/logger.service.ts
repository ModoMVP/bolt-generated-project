import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLog, LogLevel, LogCategory } from '../entities/system-log.entity';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(SystemLog)
    private logRepository: Repository<SystemLog>
  ) {}

  async log(
    message: string, 
    category: LogCategory = LogCategory.SYSTEM,
    level: LogLevel = LogLevel.INFO,
    userId?: string,
    tenantId?: string,
    metadata?: Record<string, any>
  ) {
    const log = this.logRepository.create({
      message,
      category,
      level,
      userId,
      tenantId,
      metadata
    });

    await this.logRepository.save(log);
  }

  async error(
    message: string, 
    category: LogCategory = LogCategory.SYSTEM,
    userId?: string,
    tenantId?: string,
    metadata?: Record<string, any>
  ) {
    return this.log(
      message, 
      category, 
      LogLevel.ERROR, 
      userId, 
      tenantId, 
      metadata
    );
  }

  async warn(
    message: string, 
    category: LogCategory = LogCategory.SYSTEM,
    userId?: string,
    tenantId?: string,
    metadata?: Record<string, any>
  ) {
    return this.log(
      message, 
      category, 
      LogLevel.WARN, 
      userId, 
      tenantId, 
      metadata
    );
  }
}
