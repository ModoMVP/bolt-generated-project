import { 
  Injectable, 
  ConflictException, 
  UnauthorizedException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from './entities/user.entity';
import { Tenant } from './entities/tenant.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password, tenantId } = registerDto;

    // Verificar se usuário já existe
    const existingUser = await this.userRepository.findOne({ 
      where: { email } 
    });

    if (existingUser) {
      throw new ConflictException('Usuário já cadastrado');
    }

    // Criar ou usar tenant
    let tenant: Tenant;
    if (tenantId) {
      tenant = await this.tenantRepository.findOne({ 
        where: { id: tenantId } 
      });
      if (!tenant) {
        throw new ConflictException('Tenant não encontrado');
      }
    } else {
      tenant = this.tenantRepository.create({ 
        name: `Tenant de ${name}` 
      });
      await this.tenantRepository.save(tenant);
    }

    // Criar usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      tenant
    });

    await this.userRepository.save(user);

    return this.login({ email, password });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ 
      where: { email },
      relations: ['tenant']
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }
    };
  }
}
