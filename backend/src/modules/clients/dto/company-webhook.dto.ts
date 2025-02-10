import { ClientType } from '../entities/client.entity';

export interface CompanyWebhookDto {
  id: string;
  raz_social: string;
  nome_fantasia: string;
  email: string;
  tel1: string;
  tel2: string;
  endereco: string;
  cep: string;
  cnpj_completo: string;
  n_estabelecimentos: string;
  nm_cnae: string;
  cnae_secundario: string;
  matriz_filial: string;
  descricao: string;
  uf: string;
  porte: string;
  dt_date_ini: string;
  natureza: string;
  capital_social: string;
  pais: string | null;
}

export interface MappedClientData {
  name: string;
  email: string;
  phone: string;
  document: string;
  type: ClientType;
  additionalInfo: Record<string, any>;
}
