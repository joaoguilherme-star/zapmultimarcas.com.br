FROM node:18-alpine

WORKDIR /workspace

# Copia apenas o package.json para aproveitar o cache do Docker
COPY package.json ./
COPY package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código da aplicação
COPY . .

EXPOSE 3001