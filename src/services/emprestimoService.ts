import * as emprestimoRepository from '../repositories/emprestimoRepository.js';
import * as livroRepository from '../repositories/livroRepository.js'; 
import { Emprestimo } from '../models/emprestimo.js';

export async function realizarEmprestimo(clienteId: number, livroId: number): Promise<Emprestimo> {
  const ativos = await emprestimoRepository.contarEmprestimosAtivosPorCliente(clienteId);
  if (ativos >= 3) {
    throw new Error("Limite atingido! Este cliente já possui 3 empréstimos ativos e não pode pegar mais livros.");
  }

  const livro = await livroRepository.buscarLivroPorId(livroId); 
  if (!livro || livro.quantidade_disponivel <= 0) {
    throw new Error("Estoque esgotado! Não há exemplares disponíveis deste livro para empréstimo.");
  }

  const novoEmprestimo = await emprestimoRepository.cadastrarEmprestimo(clienteId, livroId);
  await emprestimoRepository.atualizarEstoqueLivro(livroId, -1);

  return novoEmprestimo;
}

export async function realizarDevolucao(id: number, livroId: number): Promise<boolean> {
  const devolvido = await emprestimoRepository.registrarDevolucao(id);
  
  if (devolvido) {
    await emprestimoRepository.atualizarEstoqueLivro(livroId, 1);
  }
  
  return devolvido;
}