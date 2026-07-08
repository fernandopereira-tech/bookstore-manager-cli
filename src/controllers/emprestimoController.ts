import * as emprestimoService from '../services/emprestimoService.js';
import { Emprestimo } from '../models/emprestimo.js';

export async function realizarEmprestimo(clienteId: number, livroId: number): Promise<Emprestimo> {
  return await emprestimoService.cadastrarEmprestimo(clienteId, livroId);
}

export async function listar(): Promise<Emprestimo[]> {
  return await emprestimoService.listarEmprestimos();
}

export async function realizarDevolucao(id: number): Promise<boolean> {
  return await emprestimoService.registrarDevolucao(id);
}