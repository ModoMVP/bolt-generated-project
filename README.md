# CRM Modo MVP

## Descrição
Sistema de CRM completo com suporte a multi-tenancy, desenvolvido com NestJS, React e PostgreSQL.

## Pré-requisitos
- Docker
- Docker Compose
- Node.js (para desenvolvimento)

## Configuração Inicial

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/crm-modo-mvp.git
cd crm-modo-mvp
```

2. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e ajuste as configurações:
```bash
cp .env.example .env
```

3. Construir e Iniciar Containers
```bash
docker-compose up --build -d
```

## Desenvolvimento

### Frontend
- Tecnologia: React + TypeScript
- Porta: 80

### Backend
- Tecnologia: NestJS
- Porta: 3000

### Banco de Dados
- PostgreSQL
- Porta: 5432

## Variáveis de Ambiente
Verifique `.env.example` para todas as configurações necessárias.

## Contribuição
1. Faça fork do projeto
2. Crie sua feature branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença
[Especificar Licença]
