import { pool } from '../database/connection.js';

export interface Emprestimo {
  id?: number;
  cliente_id: number;
  livro_id: number;
  data_emprestimo?: Date | string;
  data_devolucao?: Date | string | null;
  nome_cliente?: string;
  titulo_livro?: string;
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

export async function registrarDevolucao(id: number): Promise<boolean> {
  const query = `
    UPDATE emprestimo 
    SET data_devolucao = CURRENT_DATE 
    WHERE id = $1 AND data_devolucao IS NULL;
  `;
  const res = await pool.query(query, [id]);
  return (res.rowCount ?? 0) > 0;
}