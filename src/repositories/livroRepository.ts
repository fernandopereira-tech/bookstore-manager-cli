import { pool } from '../database/connection.js';
import { Livro } from '../models/livro.js';

export async function buscarLivroPorId(id: number): Promise<Livro | null> {
  const query = 'SELECT * FROM livro WHERE id = $1;';
  const res = await pool.query(query, [id]);
  return res.rows.length > 0 ? res.rows[0] : null;
}

export async function cadastrarLivro(
  titulo: string, 
  anoPublicacao: number | null, 
  autorId: number, 
  quantidadeDisponivel: number
): Promise<Livro> {
  const query = `
    INSERT INTO livro (titulo, ano_publicacao, autor_id, quantidade_disponivel) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *;
  `;
  const values = [titulo, anoPublicacao, autorId, quantidadeDisponivel];
  
  const res = await pool.query(query, values);
  return res.rows[0];
}

export async function listarLivros(): Promise<Livro[]> {
  const query = `
    SELECT l.*, a.nome as nome_autor 
    FROM livro l
    INNER JOIN autor a ON l.autor_id = a.id
    ORDER BY l.titulo ASC;
  `;
  const res = await pool.query(query);
  return res.rows;
}

export async function atualizarLivro(
  id: number, 
  titulo: string, 
  anoPublicacao: number | null, 
  autorId: number,
  quantidadeDisponivel: number
): Promise<boolean> {
  const query = `
    UPDATE livro 
    SET titulo = $1, ano_publicacao = $2, autor_id = $3, quantidade_disponivel = $4
    WHERE id = $5;
  `;
  const values = [titulo, anoPublicacao, autorId, quantidadeDisponivel, id];
  
  const res = await pool.query(query, values);
  return (res.rowCount ?? 0) > 0;
}

export async function excluirLivro(id: number): Promise<boolean> {
  const query = 'DELETE FROM livro WHERE id = $1;';
  const res = await pool.query(query, [id]);
  
  return (res.rowCount ?? 0) > 0;
}