cd CREATE TABLE Autor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nacionalidade VARCHAR(100)
);


CREATE TABLE Livro (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    quantidade_estoque INTEGER NOT NULL DEFAULT 0,
    fk_autor INTEGER NOT NULL,
    CONSTRAINT fk_livro_autor FOREIGN KEY (fk_autor) REFERENCES Autor(id) ON DELETE RESTRICT
);


CREATE TABLE Cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);


CREATE TABLE Emprestimo (
    id SERIAL PRIMARY KEY,
    data_emprestimo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_devolucao TIMESTAMP,
    fk_cliente INTEGER NOT NULL,
    fk_livro INTEGER NOT NULL,
    CONSTRAINT fk_emprestimo_cliente FOREIGN KEY (fk_cliente) REFERENCES Cliente(id) ON DELETE CASCADE,
    CONSTRAINT fk_emprestimo_livro FOREIGN KEY (fk_livro) REFERENCES Livro(id) ON DELETE RESTRICT
);