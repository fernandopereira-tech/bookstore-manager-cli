import * as clienteService from '../services/clienteService.js';
import { Cliente } from '../models/cliente.js';

export async function cadastrar(nome: string, email: string, telefone: string | null): Promise<Cliente> {
  return await clienteService.cadastrarCliente(nome, email, telefone);
}

export async function listar(): Promise<Cliente[]> {
  return await clienteService.listarClientes();
}

export async function atualizar(id: number, nome: string, email: string, telefone: string | null): Promise<boolean> {
  return await clienteService.atualizarCliente(id, nome, email, telefone);
}

export async function excluir(id: number): Promise<boolean> {
  return await clienteService.excluirCliente(id);
}