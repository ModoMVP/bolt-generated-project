import { 
  Injectable, 
  NotFoundException, 
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from './entities/client.entity';
import { Tenant } from '../auth/entities/tenant.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>
  ) {}

  async create(createClientDto: CreateClientDto, currentUser: any): Promise<Client> {
    const { document } = createClientDto;

    // Verificar se cliente já existe no tenant
    const existingClient = await this.clientRepository.findOne({
      where: { 
        document, 
        tenantId: currentUser.tenantId 
      }
    });

    if (existingClient) {
      throw new ConflictException('Cliente já cadastrado');
    }

    // Buscar tenant do usuário atual
    const tenant = await this.tenantRepository.findOne({
      where: { id: currentUser.tenantId }
    });

    // Criar cliente
    const client = this.clientRepository.create({
      ...createClientDto,
      tenant
    });

    return this.clientRepository.save(client);
  }

  async findAll(currentUser: any): Promise<Client[]> {
    return this.clientRepository.find({
      where: { 
        tenantId: currentUser.tenantId 
      },
      select: ['id', 'name', 'email', 'phone', 'type', 'document', 'isActive']
    });
  }

  async findOne(id: string, currentUser: any): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { 
        id, 
        tenantId: currentUser.tenantId 
      }
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return client;
  }

  async update(
    id: string, 
    updateClientDto: UpdateClientDto, 
    currentUser: any
  ): Promise<Client> {
    const client = await this.findOne(id, currentUser);

    // Mesclar dados
    const updatedClient = { ...client, ...updateClientDto };
    return this.clientRepository.save(updatedClient);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const client = await this.findOne(id, currentUser);
    await this.clientRepository.remove(client);
  }

  async importFromWebhook(
    webhookData: any, 
    currentUser: any
  ): Promise<Client> {
    // Lógica para importar dados de webhook
    const { name, email, document, type } = webhookData;

    // Verificar se cliente já existe
    let client = await this.clientRepository.findOne({
      where: { 
        document, 
        tenantId: currentUser.tenantId 
      }
    });

    // Criar ou atualizar cliente
    if (!client) {
      return this.create({
        name,
        email,
        document,
        type
      }, currentUser);
    } else {
      return this.update(client.id, {
        name,
        email
      }, currentUser);
    }
  }
}
