import { tool } from "ai";
import { z } from "zod";
import Fastify from "fastify"; // Importando Fastify corretamente
import dotenv from "dotenv"; // Importando dotenv
dotenv.config(); // Carrega as variáveis do arquivo .env

// Instancia do Fastify
const fastify = Fastify({ logger: true });

// Registra o plugin do PostgreSQL no Fastify
fastify.register(import('@fastify/postgres'), {
  connectionString: process.env.DATABASE_URL
});

// A função que conecta ao banco de dados
async function connectToDb() {
  try {
    // Espera o servidor estar pronto antes de tentar se conectar
    await fastify.ready(); // Espera a inicialização completa do Fastify
    const client = await fastify.pg.connect(); // Conecta ao banco
    return client;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error); // Log de erro na conexão
    throw new Error('Erro ao conectar ao banco de dados');
  }
}

export const postgresTool = tool({
  description: `
    Realiza operações no banco de dados relacionadas a vendas, produtos e clientes.

    Tabelas:
    """
      CREATE TABLE clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
      );

      CREATE TABLE produtos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        preco NUMERIC(10, 2) NOT NULL
      );

      CREATE TABLE vendas (
        id SERIAL PRIMARY KEY,
        cliente_id INT REFERENCES clientes(id),
        data_venda TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE venda_produtos (
        id SERIAL PRIMARY KEY,
        venda_id INT REFERENCES vendas(id),
        produto_id INT REFERENCES produtos(id),
        quantidade INT NOT NULL
      );
    """
    Só pode fazer operação de leitura (SELECT).
  `.trim(),

  parameters: z.object({
    query: z.string().describe('A query SQL a ser executada no banco de dados.')
  }),

  execute: async ({ query, params }) => {
    try {
        console.log(query.split(';').map(q => q.trim()).filter(Boolean))

      const client = await connectToDb(); // Espera pela conexão ao banco

      // Executa a query no banco de dados
      const result = await client.query(query.split(';')[0]);
      client.release(); // Libera a conexão após o uso
      return JSON.stringify(result.rows); // Retorna os resultados da consulta
    } catch (error) {
      console.error("Erro ao executar query:", error); // Log do erro completo
      throw new Error('Erro ao executar a consulta no banco de dados');
    }
  }
});
