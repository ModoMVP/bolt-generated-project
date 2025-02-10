import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

import { User } from './entities/user.entity';
import { Tenant } from './entities/tenant.entity';
import { PasswordReset } from './entities/password-reset.entity';

import { PasswordResetService } from './services/password-reset.service';
import { PasswordResetController } from './controllers/password-reset.controller';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant, PasswordReset]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRATION') 
        }
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [
    AuthController, 
    PasswordResetController,
    ProfileController
  ],
  providers: [
    AuthService, 
    JwtStrategy,
    PasswordResetService,
    ProfileService
  ],
  exports: [AuthService, ProfileService]
})
export class AuthModule {}
