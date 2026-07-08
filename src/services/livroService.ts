import * as livroRepository from '../repositories/livroRepository.js';
import { Livro } from '../models/livro.js';

export async function registrarLivro(
  titulo: string, 
  anoPublicacao: number | null, 
  autorId: number, 
  quantidadeDisponivel: number
): Promise<Livro> {
  if (quantidadeDisponivel < 0) {
    throw new Error("Erro: A quantidade disponível do livro não pode ser menor que zero.");
  }

  return await livroRepository.cadastrarLivro(titulo, anoPublicacao, autorId, quantidadeDisponivel);
}

export async function modificarLivro(
  id: number, 
  titulo: string, 
  anoPublicacao: number | null, 
  autorId: number,
  quantidadeDisponivel: number
): Promise<boolean> {
  if (quantidadeDisponivel < 0) {
    throw new Error("Erro: A quantidade disponível do livro não pode ser menor que zero.");
  }

  return await livroRepository.atualizarLivro(id, titulo, anoPublicacao, autorId, quantidadeDisponivel);
}