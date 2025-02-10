import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import databaseConfig from './config/database.config';
import emailConfig from './config/email.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { SalesFunnelModule } from './modules/sales-funnel/sales-funnel.module';
import { DealsModule } from './modules/deals/deals.module';
import { CommonModule } from './common/common.module';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';
import { TenantNotFoundFilter } from './common/filters/tenant-not-found.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, emailConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    SalesFunnelModule,
    DealsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: TenantNotFoundFilter
    }
  ],
})
export class AppModule {}
