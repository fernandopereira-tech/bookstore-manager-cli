import { pool } from '../database/connection.js';

export interface Autor {
    id?: number;
    nome: string;
    biografia?: string;
}

export async function cadastrarAutor(nome: string, biografia: string): Promise<Autor> {
    const query = `
    INSERT INTO autor (nome, biografia) 
    VALUES ($1, $2) 
    RETURNING *;
  `;
    const values = [nome, biografia];

    const res = await pool.query(query, values);
    return res.rows[0];
}

export async function listarAutores(): Promise<Autor[]> {
    const query = 'SELECT * FROM autor ORDER BY nome ASC;';
    const res = await pool.query(query);
    return res.rows;
}

export async function atualizarAutor(id: number, nome: string, biografia: string): Promise<boolean> {
    const query = `
    UPDATE autor 
    SET nome = $1, biografia = $2 
    WHERE id = $3;
  `;
    const values = [nome, biografia, id];

    const res = await pool.query(query, values);
    return (res.rowCount ?? 0) > 0;
}

export async function excluirAutor(id: number): Promise<boolean> {
    const query = 'DELETE FROM autor WHERE id = $1;';
    const res = await pool.query(query, [id]);

    return (res.rowCount ?? 0) > 0;
}