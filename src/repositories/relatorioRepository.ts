import { pool } from '../database/connection.js';

export async function obterLivrosDisponiveis(): Promise<any[]> {
  const query = `
    SELECT id, titulo, quantidade_disponivel 
    FROM livro 
    WHERE quantidade_disponivel > 0 
    ORDER BY titulo ASC;
  `;
  const res = await pool.query(query);
  return res.rows;
}

export async function obterLivrosEmprestados(): Promise<any[]> {
  const query = `
    SELECT DISTINCT l.id, l.titulo 
    FROM emprestimo e
    INNER JOIN livro l ON e.livro_id = l.id
    WHERE e.data_devolucao IS NULL
    ORDER BY l.titulo ASC;
  `;
  const res = await pool.query(query);
  return res.rows;
}

export async function obterLivrosPorAutor(): Promise<any[]> {
  const query = `
    SELECT a.nome AS autor, COUNT(l.id) AS quantidade
    FROM autor a
    LEFT JOIN livro l ON a.id = l.autor_id
    GROUP BY a.nome
    ORDER BY quantidade DESC;
  `;
  const res = await pool.query(query);
  return res.rows;
}

export async function obterQuantidadeEmprestimosPorLivro(): Promise<any[]> {
  const query = `
    SELECT l.titulo, COUNT(e.id) AS quantidade
    FROM livro l
    LEFT JOIN emprestimo e ON l.id = e.livro_id
    GROUP BY l.titulo
    ORDER BY quantidade DESC;
  `;
  const res = await pool.query(query);
  return res.rows;
}

export async function obterClientesComEmprestimosAtivos(): Promise<any[]> {
  const query = `
    SELECT DISTINCT c.id, c.nome, c.email 
    FROM emprestimo e
    INNER JOIN cliente c ON e.cliente_id = c.id
    WHERE e.data_devolucao IS NULL
    ORDER BY c.nome ASC;
  `;
  const res = await pool.query(query);
  return res.rows;
}