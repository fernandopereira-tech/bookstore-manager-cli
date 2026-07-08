import * as livroRepository from '../repositories/livroRepository.js';
import { Livro } from '../models/livro.js';

export async function cadastrarLivro(titulo: string, anoPublicacao: number | null, autorId: number, quantidade: number): Promise<Livro> {
  if (!titulo.trim()) throw new Error('O titulo do livro nao pode ser vazio.');
  if (quantidade < 0) throw new Error('A quantidade nao pode ser negativa.');
  return await livroRepository.cadastrarLivro(titulo, anoPublicacao, autorId, quantidade);
}

export async function listarLivros(): Promise<Livro[]> {
  return await livroRepository.listarLivros();
}

export async function atualizarLivro(id: number, titulo: string, anoPublicacao: number | null, autorId: number, quantidade: number): Promise<boolean> {
  if (!titulo.trim()) throw new Error('O titulo do livro nao pode ser vazio.');
  if (quantidade < 0) throw new Error('A quantidade nao pode ser negativa.');
  return await livroRepository.atualizarLivro(id, titulo, anoPublicacao, autorId, quantidade);
}

export async function excluirLivro(id: number): Promise<boolean> {
  return await livroRepository.excluirLivro(id);
}