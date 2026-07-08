import * as livroService from '../services/livroService.js';
import { Livro } from '../models/livro.js';

export async function cadastrar(titulo: string, anoPublicacao: number | null, autorId: number, quantidade: number): Promise<Livro> {
  return await livroService.cadastrarLivro(titulo, anoPublicacao, autorId, quantidade);
}

export async function listar(): Promise<Livro[]> {
  return await livroService.listarLivros();
}

export async function atualizar(id: number, titulo: string, anoPublicacao: number | null, autorId: number, quantidade: number): Promise<boolean> {
  return await livroService.atualizarLivro(id, titulo, anoPublicacao, autorId, quantidade);
}

export async function excluir(id: number): Promise<boolean> {
  return await livroService.excluirLivro(id);
}