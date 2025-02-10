import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from '../auth/entities/user.entity';
import { Tenant } from '../auth/entities/tenant.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>
  ) {}

  async create(createUserDto: CreateUserDto, currentUser: any): Promise<User> {
    const { email, password, name, role, tenantId } = createUserDto;

    // Verificar se usuário já existe
    const existingUser = await this.userRepository.findOne({ 
      where: { email } 
    });

    if (existingUser) {
      throw new ConflictException('Usuário já cadastrado');
    }

    // Determinar o tenant
    let tenant: Tenant;
    if (tenantId) {
      // Verificar se o tenant existe e pertence ao usuário atual
      tenant = await this.tenantRepository.findOne({ 
        where: { 
          id: tenantId,
          id: currentUser.tenantId 
        } 
      });

      if (!tenant) {
        throw new ForbiddenException('Tenant inválido');
      }
    } else {
      // Usar o tenant do usuário atual
      tenant = await this.tenantRepository.findOne({ 
        where: { id: currentUser.tenantId } 
      });
    }

    // Criar usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.USER,
      tenant
    });

    return this.userRepository.save(user);
  }

  async findAll(currentUser: any): Promise<User[]> {
    return this.userRepository.find({
      where: { 
        tenantId: currentUser.tenantId 
      },
      select: ['id', 'name', 'email', 'role', 'isActive']
    });
  }

  async findOne(id: string, currentUser: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { 
        id, 
        tenantId: currentUser.tenantId 
      },
      select: ['id', 'name', 'email', 'role', 'isActive']
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(
    id: string, 
    updateUserDto: UpdateUserDto, 
    currentUser: any
  ): Promise<User> {
    const user = await this.findOne(id, currentUser);

    // Impedir que usuários comuns alterem roles de outros
    if (currentUser.role !== UserRole.ADMIN && 
        updateUserDto.role && 
        updateUserDto.role !== user.role) {
      throw new ForbiddenException('Sem permissão para alterar role');
    }

    // Atualizar senha com hash
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Mesclar dados
    const updatedUser = { ...user, ...updateUserDto };
    return this.userRepository.save(updatedUser);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const user = await this.findOne(id, currentUser);

    // Impedir remoção do próprio usuário
    if (user.id === currentUser.id) {
      throw new ForbiddenException('Não é possível remover o próprio usuário');
    }

    await this.userRepository.remove(user);
  }
}
