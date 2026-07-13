import * as emprestimoRepository from '../repositories/emprestimoRepository.js';
import * as livroRepository from '../repositories/livroRepository.js';
import * as clienteRepository from '../repositories/clienteRepository.js';
import { Emprestimo } from '../models/emprestimo.js';

export async function cadastrarEmprestimo(clienteId: number, livroId: number): Promise<Emprestimo> {
  const cliente = await clienteRepository.buscarClientePorId(clienteId);
  if (!cliente) throw new Error('Cliente nao encontrado.');

  const livro = await livroRepository.buscarLivroPorId(livroId);
  if (!livro) throw new Error('Livro nao encontrado.');
  if (!livro.quantidade_disponivel || livro.quantidade_disponivel <= 0) throw new Error('Livro esgotado no estoque.');

  const ativos = await emprestimoRepository.contarEmprestimosAtivosPorCliente(clienteId);
  if (ativos >= 3) throw new Error('Cliente ja possui o limite maximo de 3 emprestimos ativos.');

  await emprestimoRepository.atualizarEstoqueLivro(livroId, -1);
  return await emprestimoRepository.cadastrarEmprestimo(clienteId, livroId);
}

export async function listarEmprestimos(): Promise<Emprestimo[]> {
  return await emprestimoRepository.listarEmprestimos();
}

export async function registrarDevolucao(id: number): Promise<boolean> {
  const resultado = await emprestimoRepository.registrarDevolucao(id);
  if (!resultado) return false;

  await emprestimoRepository.atualizarEstoqueLivro(resultado.livro_id, 1);
  return true;
}