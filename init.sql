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

INSERT INTO clientes (nome, email) VALUES
  ('João Silva', 'joao@gmail.com'),
  ('Maria Souza', 'maria@gmail.com');

INSERT INTO produtos (nome, preco) VALUES
  ('Notebook', 3500.00),
  ('Mouse', 50.00),
  ('Teclado', 120.00);

INSERT INTO vendas (cliente_id) VALUES
  (1),
  (2);

INSERT INTO venda_produtos (venda_id, produto_id, quantidade) VALUES
  (1, 1, 1),
  (1, 2, 2),
  (2, 3, 1);