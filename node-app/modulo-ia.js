import { generateText } from 'ai';
import { googleModel } from './ai/googleai.js'; // Assumindo que você tenha um modelo AI para consulta
import { postgresTool } from './ai/tool/postgres-tool.js';

export async function answerUserMessage(message) {
  // Gerar a resposta usando o modelo de IA, com as ferramentas integradas
  const answer = await generateText({
    model: googleModel, // Usando o modelo da Google AI
    tools: {
      postgresTool,  // Ferramenta para executar consultas no banco de dados PostgreSQL
    },
    prompt: message,  // Mensagem que o usuário perguntou
    system: `
      Você é um assistente de I.A. que responde a perguntas de programação e consultas ao banco de dados.

      Respostas devem ser diretas e no formato Markdown, sem explicações extras, apenas o que o usuário pediu.
      Não inclua blocos de código (\`\`\`) na resposta.

      Caso a consulta envolva dados de um banco de dados, retorne a informação necessária em Markdown.
    `.trim(),
    maxSteps: 5,  // Limitar o número de passos que a IA pode tomar para responder
  });

  // Retornar a resposta processada da IA
  return { response: answer.text };
}
