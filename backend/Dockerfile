# Usar imagem oficial do Node
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências globais
RUN npm install -g npm@latest @nestjs/cli

# Instalar dependências do projeto
RUN npm ci --silent

# Copiar código fonte
COPY . .

# Construir aplicação
RUN npm run build

# Expor porta do backend
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
