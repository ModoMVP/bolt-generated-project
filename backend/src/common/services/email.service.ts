import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const emailConfig = this.configService.get('email');
    this.transporter = createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass
      }
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `https://crm.modomvp.com.br/reset-password?token=${token}`;
    
    return this.sendEmail({
      to,
      subject: 'Redefinição de Senha',
      template: 'password-reset',
      context: {
        resetLink,
        supportEmail: 'suporte@modomvp.com.br'
      }
    });
  }

  async sendUserInviteEmail(to: string, inviteLink: string) {
    return this.sendEmail({
      to,
      subject: 'Convite para o CRM',
      template: 'user-invite',
      context: {
        inviteLink,
        companyName: 'Modo MVP'
      }
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    return this.sendEmail({
      to,
      subject: 'Bem-vindo ao CRM',
      template: 'welcome',
      context: {
        name,
        loginUrl: 'https://crm.modomvp.com.br'
      }
    });
  }

  private async sendEmail(options: EmailOptions) {
    const emailConfig = this.configService.get('email');

    try {
      await this.transporter.sendMail({
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to: options.to,
        subject: options.subject,
        html: this.renderTemplate(options.template, options.context)
      });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      // Pode adicionar log de erro ou tratamento específico
    }
  }

  private renderTemplate(template: string, context: Record<string, any>): string {
    // Implementação simples de template
    // Em produção, usar handlebars ou outro template engine
    switch(template) {
      case 'password-reset':
        return `
          <h1>Redefinição de Senha</h1>
          <p>Clique no link para redefinir sua senha:</p>
          <a href="${context.resetLink}">Redefinir Senha</a>
          <p>Caso não tenha solicitado, ignore este email.</p>
        `;
      case 'user-invite':
        return `
          <h1>Convite para o CRM</h1>
          <p>Você foi convidado para usar o CRM da Modo MVP</p>
          <a href="${context.inviteLink}">Aceitar Convite</a>
        `;
      case 'welcome':
        return `
          <h1>Bem-vindo, ${context.name}!</h1>
          <p>Sua conta foi criada com sucesso.</p>
          <a href="${context.loginUrl}">Fazer Login</a>
        `;
      default:
        return '<p>Mensagem do Sistema</p>';
    }
  }
}
