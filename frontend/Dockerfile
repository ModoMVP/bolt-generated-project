# Usar imagem oficial do Node como base para build
FROM node:18-alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências globais
RUN npm install -g npm@latest

# Instalar dependências do projeto
RUN npm ci --silent

# Copiar código fonte
COPY . .

# Construir aplicação
RUN npm run build

# Usar Nginx para servir a aplicação
FROM nginx:alpine

# Copiar build da aplicação
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
