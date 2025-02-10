import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CompanyWebhookDto, MappedClientData } from '../dto/company-webhook.dto';
import { ClientType } from '../entities/client.entity';

@Injectable()
export class CompanyWebhookService {
  private readonly baseUrl = 'https://app.modomvp.com.br/empresa';
  private readonly username = 'gabriel.alberti@modomvp.com.br';
  private readonly password = 'Gma!01292';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async fetchCompanyDetails(cnpj: string): Promise<MappedClientData> {
    // Remover caracteres não numéricos do CNPJ
    const cleanCnpj = cnpj.replace(/\D/g, '');

    try {
      // Fazer login primeiro
      const loginResponse = await axios.post('https://app.modomvp.com.br/api/login', {
        email: this.username,
        password: this.password
      });

      // Extrair token de autenticação
      const token = loginResponse.data.token;

      // Fazer requisição para buscar detalhes da empresa
      const companyResponse = await axios.get<CompanyWebhookDto>(`${this.baseUrl}/${cleanCnpj}/detalhes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Mapear dados para o formato do cliente
      return this.mapCompanyToClient(companyResponse.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes da empresa:', error);
      throw new Error('Não foi possível buscar detalhes da empresa');
    }
  }

  private mapCompanyToClient(company: CompanyWebhookDto): MappedClientData {
    return {
      name: company.raz_social || company.nome_fantasia,
      email: company.email !== '-' ? company.email : '',
      phone: company.tel1 !== '-' ? company.tel1 : (company.tel2 !== '-' ? company.tel2 : ''),
      document: company.cnpj_completo,
      type: ClientType.PESSOA_JURIDICA,
      additionalInfo: {
        fantasyName: company.nome_fantasia,
        cnae: company.nm_cnae,
        size: company.porte,
        foundationDate: company.dt_date_ini,
        address: company.endereco,
        cep: company.cep,
        state: company.uf,
        natureOfCompany: company.natureza,
        capitalSocial: company.capital_social,
        establishments: company.n_estabelecimentos
      }
    };
  }
}
