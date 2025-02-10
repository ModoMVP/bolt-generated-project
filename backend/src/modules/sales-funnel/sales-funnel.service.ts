import { 
  Injectable, 
  NotFoundException, 
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SalesFunnel } from './entities/sales-funnel.entity';
import { SalesFunnelStage } from './entities/sales-funnel-stage.entity';
import { Tenant } from '../auth/entities/tenant.entity';
import { CreateSalesFunnelDto } from './dto/create-sales-funnel.dto';
import { UpdateSalesFunnelDto } from './dto/update-sales-funnel.dto';

@Injectable()
export class SalesFunnelService {
  constructor(
    @InjectRepository(SalesFunnel)
    private salesFunnelRepository: Repository<SalesFunnel>,
    @InjectRepository(SalesFunnelStage)
    private salesFunnelStageRepository: Repository<SalesFunnelStage>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>
  ) {}

  async create(
    createSalesFunnelDto: CreateSalesFunnelDto, 
    currentUser: any
  ): Promise<SalesFunnel> {
    const { stages, ...funnelData } = createSalesFunnelDto;

    // Buscar tenant do usuário atual
    const tenant = await this.tenantRepository.findOne({
      where: { id: currentUser.tenantId }
    });

    // Criar funil de vendas
    const salesFunnel = this.salesFunnelRepository.create({
      ...funnelData,
      tenant
    });

    // Adicionar estágios
    if (stages && stages.length > 0) {
      salesFunnel.stages = stages.map((stage, index) => 
        this.salesFunnelStageRepository.create({
          ...stage,
          order: index,
          funnel: salesFunnel
        })
      );
    }

    return this.salesFunnelRepository.save(salesFunnel);
  }

  async findAll(currentUser: any): Promise<SalesFunnel[]> {
    return this.salesFunnelRepository.find({
      where: { 
        tenantId: currentUser.tenantId 
      },
      relations: ['stages'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: string, currentUser: any): Promise<SalesFunnel> {
    const salesFunnel = await this.salesFunnelRepository.findOne({
      where: { 
        id, 
        tenantId: currentUser.tenantId 
      },
      relations: ['stages']
    });

    if (!salesFunnel) {
      throw new NotFoundException('Funil de vendas não encontrado');
    }

    return salesFunnel;
  }

  async update(
    id: string, 
    updateSalesFunnelDto: UpdateSalesFunnelDto, 
    currentUser: any
  ): Promise<SalesFunnel> {
    const { stages, ...funnelData } = updateSalesFunnelDto;
    const salesFunnel = await this.findOne(id, currentUser);

    // Atualizar dados do funil
    Object.assign(salesFunnel, funnelData);

    // Atualizar ou adicionar estágios
    if (stages) {
      // Remover estágios existentes
      await this.salesFunnelStageRepository.delete({ 
        funnelId: salesFunnel.id 
      });

      // Adicionar novos estágios
      salesFunnel.stages = stages.map((stage, index) => 
        this.salesFunnelStageRepository.create({
          ...stage,
          order: index,
          funnel: salesFunnel
        })
      );
    }

    return this.salesFunnelRepository.save(salesFunnel);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const salesFunnel = await this.findOne(id, currentUser);
    await this.salesFunnelRepository.remove(salesFunnel);
  }

  async getDefaultFunnel(currentUser: any): Promise<SalesFunnel> {
    let defaultFunnel = await this.salesFunnelRepository.findOne({
      where: { 
        tenantId: currentUser.tenantId,
        name: 'Funil Padrão' 
      }
    });

    if (!defaultFunnel) {
      defaultFunnel = await this.create({
        name: 'Funil Padrão',
        stages: [
          { name: 'Prospecção', color: 'blue' },
          { name: 'Qualificação', color: 'green' },
          { name: 'Proposta', color: 'yellow' },
          { name: 'Negociação', color: 'red' },
          { name: 'Fechamento', color: 'green' }
        ]
      }, currentUser);
    }

    return defaultFunnel;
  }
}
