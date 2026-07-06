import { pool } from '../database/connection.js';

export interface Livro {
  id?: number;
  titulo: string;
  ano_publicacao?: number;
  autor_id: number;
  nome_autor?: string;
}

export async function cadastrarLivro(titulo: string, anoPublicacao: number | null, autorId: number): Promise<Livro> {
  const query = `
    INSERT INTO livro (titulo, ano_publicacao, autor_id) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const values = [titulo, anoPublicacao, autorId];
  
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

export async function atualizarLivro(id: number, titulo: string, anoPublicacao: number | null, autorId: number): Promise<boolean> {
  const query = `
    UPDATE livro 
    SET titulo = $1, ano_publicacao = $2, autor_id = $3 
    WHERE id = $4;
  `;
  const values = [titulo, anoPublicacao, autorId, id];
  
  const res = await pool.query(query, values);
  return (res.rowCount ?? 0) > 0;
}

export async function excluirLivro(id: number): Promise<boolean> {
  const query = 'DELETE FROM livro WHERE id = $1;';
  const res = await pool.query(query, [id]);
  
  return (res.rowCount ?? 0) > 0;
}