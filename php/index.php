<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Formulário de Pergunta</title>

  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

  <!-- Biblioteca opcional para converter Markdown para HTML -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <script>
    $(document).ready(function () {
      $('#askForm').submit(function (event) {
        event.preventDefault();

        const pergunta = $('#pergunta').val().trim();

        if (pergunta) {
          $.ajax({
            url: `http://localhost:3000/pergunta/${encodeURIComponent(pergunta)}`,
            type: 'GET',
            success: function (response) {
              let parsed = response;

              // Se vier como JSON (esperado)
              if (typeof response === 'string') {
                try {
                  parsed = JSON.parse(response);
                } catch (e) {
                  // mantém como string se não for JSON válido
                }
              }

              // Verifica se tem campo "response" e formata
              if (parsed && parsed.response) {
                const markdown = parsed.response;

                // Usa 'marked' para converter markdown (ex: ```blocos de código```) para HTML
                const html = marked.parse(markdown);

                $('#resposta').html(`<div>${html}</div>`);
              } else {
                $('#resposta').html(`<div>${parsed}</div>`);
              }
            },
            error: function () {
              $('#resposta').html('<strong style="color: red;">Erro ao enviar a pergunta.</strong>');
            }
          });
        } else {
          $('#resposta').html('<strong style="color: red;">Por favor, insira uma pergunta.</strong>');
        }
      });
    });
  </script>
</head>
<body>
  <h1>Faça uma Pergunta</h1>

  <form id="askForm">
    <label for="pergunta">Pergunta:</label><br />
    <input type="text" id="pergunta" name="pergunta" placeholder="Exemplo: Qual o preço do produto X?" required /><br /><br />
    <button type="submit">Enviar</button>
  </form>

  <h3>Resposta:</h3>
  <div id="resposta" style="white-space: pre-wrap;"></div>
</body>
</html>
