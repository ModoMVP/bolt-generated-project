import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Deal, DealPriority } from './entities/deal.entity';
import { Tenant } from '../auth/entities/tenant.entity';
import { Client } from '../clients/entities/client.entity';
import { SalesFunnelStage } from '../sales-funnel/entities/sales-funnel-stage.entity';
import { User } from '../auth/entities/user.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(SalesFunnelStage)
    private stageRepository: Repository<SalesFunnelStage>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createDealDto: CreateDealDto, currentUser: any): Promise<Deal> {
    const { 
      clientId, 
      stageId, 
      responsibleId, 
      ...dealData 
    } = createDealDto;

    // Buscar tenant do usuário atual
    const tenant = await this.tenantRepository.findOne({
      where: { id: currentUser.tenantId }
    });

    // Validar relacionamentos
    const deal = this.dealRepository.create({
      ...dealData,
      tenant,
      priority: dealData.priority || DealPriority.MEDIUM
    });

    // Associar cliente se fornecido
    if (clientId) {
      const client = await this.clientRepository.findOne({
        where: { 
          id: clientId, 
          tenantId: currentUser.tenantId 
        }
      });
      if (!client) {
        throw new NotFoundException('Cliente não encontrado');
      }
      deal.client = client;
    }

    // Associar estágio se fornecido
    if (stageId) {
      const stage = await this.stageRepository.findOne({
        where: { 
          id: stageId,
          funnel: { tenantId: currentUser.tenantId }
        }
      });
      if (!stage) {
        throw new NotFoundException('Estágio não encontrado');
      }
      deal.stage = stage;
    }

    // Associar responsável se fornecido
    if (responsibleId) {
      const responsible = await this.userRepository.findOne({
        where: { 
          id: responsibleId, 
          tenantId: currentUser.tenantId 
        }
      });
      if (!responsible) {
        throw new NotFoundException('Responsável não encontrado');
      }
      deal.responsible = responsible;
    }

    return this.dealRepository.save(deal);
  }

  async findAll(currentUser: any): Promise<Deal[]> {
    return this.dealRepository.find({
      where: { 
        tenantId: currentUser.tenantId 
      },
      relations: ['client', 'stage', 'responsible'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: string, currentUser: any): Promise<Deal> {
    const deal = await this.dealRepository.findOne({
      where: { 
        id, 
        tenantId: currentUser.tenantId 
      },
      relations: ['client', 'stage', 'responsible']
    });

    if (!deal) {
      throw new NotFoundException('Negócio não encontrado');
    }

    return deal;
  }

  async update(
    id: string, 
    updateDealDto: UpdateDealDto, 
    currentUser: any
  ): Promise<Deal> {
    const { 
      clientId, 
      stageId, 
      responsibleId, 
      ...dealData 
    } = updateDealDto;

    const deal = await this.findOne(id, currentUser);

    // Atualizar dados básicos
    Object.assign(deal, dealData);

    // Atualizar cliente se fornecido
    if (clientId) {
      const client = await this.clientRepository.findOne({
        where: { 
          id: clientId, 
          tenantId: currentUser.tenantId 
        }
      });
      if (!client) {
        throw new NotFoundException('Cliente não encontrado');
      }
      deal.client = client;
    }

    // Atualizar estágio se fornecido
    if (stageId) {
      const stage = await this.stageRepository.findOne({
        where: { 
          id: stageId,
          funnel: { tenantId: currentUser.tenantId }
        }
      });
      if (!stage) {
        throw new NotFoundException('Estágio não encontrado');
      }
      deal.stage = stage;
    }

    // Atualizar responsável se fornecido
    if (responsibleId) {
      const responsible = await this.userRepository.findOne({
        where: { 
          id: responsibleId, 
          tenantId: currentUser.tenantId 
        }
      });
      if (!responsible) {
        throw new NotFoundException('Responsável não encontrado');
      }
      deal.responsible = responsible;
    }

    return this.dealRepository.save(deal);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const deal = await this.findOne(id, currentUser);
    await this.dealRepository.remove(deal);
  }

  async moveToStage(
    id: string, 
    stageId: string, 
    currentUser: any
  ): Promise<Deal> {
    const deal = await this.findOne(id, currentUser);

    const stage = await this.stageRepository.findOne({
      where: { 
        id: stageId,
        funnel: { tenantId: currentUser.tenantId }
      }
    });

    if (!stage) {
      throw new NotFoundException('Estágio não encontrado');
    }

    deal.stage = stage;
    return this.dealRepository.save(deal);
  }
}
