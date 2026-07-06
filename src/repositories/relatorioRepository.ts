import { pool } from '../database/connection.js';

export interface RelatorioLivro {
  titulo: string;
  quantidade: number;
}

export interface RelatorioCliente {
  nome: string;
  quantidade: number;
}

export interface RelatorioStatus {
  status: string;
  quantidade: number;
}

export async function obterLivrosMaisEmprestados(): Promise<RelatorioLivro[]> {
  const query = `
    SELECT l.titulo, COUNT(e.id) AS quantidade
    FROM emprestimo e
    INNER JOIN livro l ON e.livro_id = l.id
    GROUP BY l.titulo
    ORDER BY quantidade DESC
    LIMIT 5;
  `;
  const res = await pool.query(query);
  return res.rows;
}

export async function obterClientesMaisAtivos(): Promise<RelatorioCliente[]> {
  const query = `
    SELECT c.nome, COUNT(e.id) AS quantidade
    FROM emprestimo e
    INNER JOIN cliente c ON e.cliente_id = c.id
    GROUP BY c.nome
    ORDER BY quantidade DESC
    LIMIT 5;
  `;
  const res = await pool.query(query);
  return res.rows;
}

export async function obterResumoStatus(): Promise<RelatorioStatus[]> {
  const query = `
    SELECT 
      CASE 
        WHEN data_devolucao IS NULL THEN 'Em aberto'
        ELSE 'Devolvido'
      END AS status,
      COUNT(id) AS quantidade
    FROM emprestimo
    GROUP BY status;
  `;
  const res = await pool.query(query);
  return res.rows;
}