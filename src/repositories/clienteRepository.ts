import { pool } from '../database/connection.js';
import { Cliente } from '../models/cliente.js';

export async function buscarClientePorEmail(email: string): Promise<Cliente | null> {
  const query = 'SELECT * FROM cliente WHERE email = $1;';
  const res = await pool.query(query, [email.trim()]);
  return res.rows.length > 0 ? res.rows[0] : null;
}

export async function buscarClientePorId(id: number): Promise<Cliente | null> {
  const query = 'SELECT * FROM cliente WHERE id = $1;';
  const res = await pool.query(query, [id]);
  return res.rows.length > 0 ? res.rows[0] : null;
}

export async function cadastrarCliente(nome: string, email: string, telefone: string | null): Promise<Cliente> {
  const query = `
    INSERT INTO cliente (nome, email, telefone) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const values = [nome, email, telefone];
  
  const res = await pool.query(query, values);
  return res.rows[0];
}

export async function listarClientes(): Promise<Cliente[]> {
  const query = 'SELECT * FROM cliente ORDER BY nome ASC;';
  const res = await pool.query(query);
  return res.rows;
}

export async function atualizarCliente(id: number, nome: string, email: string, telefone: string | null): Promise<boolean> {
  const query = `
    UPDATE cliente 
    SET nome = $1, email = $2, telefone = $3 
    WHERE id = $4;
  `;
  const values = [nome, email, telefone, id];
  
  const res = await pool.query(query, values);
  return (res.rowCount ?? 0) > 0;
}

export async function excluirCliente(id: number): Promise<boolean> {
  const query = 'DELETE FROM cliente WHERE id = $1;';
  const res = await pool.query(query, [id]);
  
  return (res.rowCount ?? 0) > 0;
}