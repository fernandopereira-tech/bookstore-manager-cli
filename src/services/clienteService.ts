import * as clienteRepository from '../repositories/clienteRepository.js';
import { Cliente } from '../models/cliente.js';

export async function cadastrarCliente(nome: string, email: string, telefone: string | null): Promise<Cliente> {
  if (!nome.trim()) throw new Error('O nome do cliente nao pode ser vazio.');
  if (!email.includes('@')) throw new Error('Email invalido.');
  
  const clienteExistente = await clienteRepository.buscarClientePorEmail(email);
  if (clienteExistente) throw new Error('Email ja cadastrado.');

  return await clienteRepository.cadastrarCliente(nome, email, telefone);
}

export async function listarClientes(): Promise<Cliente[]> {
  return await clienteRepository.listarClientes();
}

export async function atualizarCliente(id: number, nome: string, email: string, telefone: string | null): Promise<boolean> {
  if (!nome.trim()) throw new Error('O nome do cliente nao pode ser vazio.');
  return await clienteRepository.atualizarCliente(id, nome, email, telefone);
}

export async function excluirCliente(id: number): Promise<boolean> {
  return await clienteRepository.excluirCliente(id);
}