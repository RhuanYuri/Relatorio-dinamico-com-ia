import Fastify from 'fastify';
import cors from '@fastify/cors'; // Importa o CORS
import { answerUserMessage } from './modulo-ia.js';
import dotenv from 'dotenv';
dotenv.config(); 

const fastify = Fastify({ logger: true });

// Ativa o CORS para permitir requisições externas
fastify.register(cors, { 
  origin: '*', // Permite requisições de qualquer origem (pode restringir se necessário)
  methods: ['GET', 'POST'] // Define os métodos permitidos
});

// Registra o plugin do PostgreSQL
fastify.register(import('@fastify/postgres'), {
  connectionString: process.env.DATABASE_URL
});

fastify.get('/clientes', async (request, reply) => {
  const client = await fastify.pg.connect();
  const { rows } = await client.query(`
    SELECT SUM(preco * quantidade) AS total
    FROM produtos 
    INNER JOIN venda_produtos ON produtos.id = venda_produtos.produto_id 
    INNER JOIN vendas ON venda_produtos.venda_id = vendas.id
  `);
  client.release();
  return rows;
});

fastify.get('/produtos', async (request, reply) => {
  const client = await fastify.pg.connect();
  const { rows } = await client.query('SELECT * FROM produtos');
  client.release();
  return rows;
});

fastify.get('/pergunta/:mensagem', async (request, reply) => {
  const result = answerUserMessage(request.params.mensagem);
  return result;
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
  console.log(`Servidor rodando em ${address}`);
});
