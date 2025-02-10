import { 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { PasswordReset } from '../entities/password-reset.entity';
import { RequestPasswordResetDto, ResetPasswordDto } from '../dto/password-reset.dto';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>
  ) {}

  async requestPasswordReset(
    requestDto: RequestPasswordResetDto
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { email: requestDto.email }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex');
    
    // Criar registro de reset de senha
    const passwordReset = this.passwordResetRepository.create({
      user,
      token,
      expiresAt: new Date(Date.now() + 3600000) // 1 hora de validade
    });

    await this.passwordResetRepository.save(passwordReset);

    // TODO: Implementar envio de email
    // await this.emailService.sendPasswordResetEmail(user.email, token);

    return { 
      message: 'Link de redefinição de senha enviado' 
    };
  }

  async resetPassword(
    resetDto: ResetPasswordDto
  ): Promise<{ message: string }> {
    // Encontrar token válido
    const passwordReset = await this.passwordResetRepository.findOne({
      where: { 
        token: resetDto.token,
        used: false,
        expiresAt: MoreThan(new Date())
      },
      relations: ['user']
    });

    if (!passwordReset) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Atualizar senha do usuário
    const hashedPassword = await bcrypt.hash(resetDto.newPassword, 10);
    
    passwordReset.user.password = hashedPassword;
    passwordReset.used = true;

    await this.userRepository.save(passwordReset.user);
    await this.passwordResetRepository.save(passwordReset);

    return { 
      message: 'Senha redefinida com sucesso' 
    };
  }
}
