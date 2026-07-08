import * as autorService from '../services/autorService.js';
import { Autor } from '../models/autor.js';

export async function cadastrar(nome: string, biografia: string): Promise<Autor> {
  return await autorService.cadastrarAutor(nome, biografia);
}

export async function listar(): Promise<Autor[]> {
  return await autorService.listarAutores();
}

export async function atualizar(id: number, nome: string, biografia: string): Promise<boolean> {
  return await autorService.atualizarAutor(id, nome, biografia);
}

export async function excluir(id: number): Promise<boolean> {
  return await autorService.excluirAutor(id);
}