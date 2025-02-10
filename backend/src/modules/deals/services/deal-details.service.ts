import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from '../entities/deal.entity';
import { DealDetailsDto } from '../dto/deal-details.dto';

@Injectable()
export class DealDetailsService {
  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>
  ) {}

  async getDealDetails(
    dealId: string, 
    currentUser: any
  ): Promise<DealDetailsDto> {
    const deal = await this.dealRepository.findOne({
      where: { 
        id: dealId, 
        tenantId: currentUser.tenantId 
      },
      relations: [
        'client', 
        'stage', 
        'responsible', 
        'interactions', 
        'tasks'
      ]
    });

    if (!deal) {
      throw new NotFoundException('Negócio não encontrado');
    }

    return DealDetailsDto.fromEntity(deal);
  }
}
