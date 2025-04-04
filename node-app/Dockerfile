FROM node:20

# Diretório de trabalho
WORKDIR /node-app

# Copia o package.json e package-lock.json primeiro para otimizar cache
COPY package.json ./

# Força limpeza de cache para evitar erros e instala dependências
RUN npm install

# Copia o restante dos arquivos do app
COPY . .

# Expõe a porta que o Fastify irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
