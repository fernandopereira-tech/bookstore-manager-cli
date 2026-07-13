import { pool } from '../database/connection.js';
import { Emprestimo } from '../models/emprestimo.js';

export async function contarEmprestimosAtivosPorCliente(clienteId: number): Promise<number> {
  const query = `
    SELECT COUNT(*) FROM emprestimo 
    WHERE cliente_id = $1 AND data_devolucao IS NULL;
  `;
  const res = await pool.query(query, [clienteId]);
  return parseInt(res.rows[0].count);
}

export async function atualizarEstoqueLivro(livroId: number, quantidade: number): Promise<void> {
  const query = `
    UPDATE livro 
    SET quantidade_disponivel = quantidade_disponivel + $1 
    WHERE id = $2;
  `;
  await pool.query(query, [quantidade, livroId]);
}

export async function cadastrarEmprestimo(clienteId: number, livroId: number): Promise<Emprestimo> {
  const query = `
    INSERT INTO emprestimo (cliente_id, livro_id) 
    VALUES ($1, $2) 
    RETURNING *;
  `;
  const values = [clienteId, livroId];
  
  const res = await pool.query(query, values);
  return res.rows[0];
}

export async function listarEmprestimos(): Promise<Emprestimo[]> {
  const query = `
    SELECT 
      e.id,
      e.cliente_id,
      e.livro_id,
      TO_CHAR(e.data_emprestimo, 'DD/MM/YYYY') AS data_emprestimo,
      TO_CHAR(e.data_devolucao, 'DD/MM/YYYY') AS data_devolucao,
      c.nome AS nome_cliente,
      l.titulo AS titulo_livro
    FROM emprestimo e
    INNER JOIN cliente c ON e.cliente_id = c.id
    INNER JOIN livro l ON e.livro_id = l.id
    ORDER BY e.id DESC;
  `;
  const res = await pool.query(query);
  return res.rows;
}

export async function registrarDevolucao(id: number): Promise<{ livro_id: number } | null> {
  const query = `
    UPDATE emprestimo 
    SET data_devolucao = CURRENT_DATE 
    WHERE id = $1 AND data_devolucao IS NULL
    RETURNING livro_id;
  `;
  const res = await pool.query(query, [id]);
  return res.rows[0] ?? null;
}