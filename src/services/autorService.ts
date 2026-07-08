import * as autorRepository from '../repositories/autorRepository.js';
import { Autor } from '../models/autor.js';

export async function cadastrarAutor(nome: string, biografia: string): Promise<Autor> {
  if (!nome.trim()) throw new Error('O nome do autor nao pode ser vazio.');
  return await autorRepository.cadastrarAutor(nome, biografia);
}

export async function listarAutores(): Promise<Autor[]> {
  return await autorRepository.listarAutores();
}

export async function atualizarAutor(id: number, nome: string, biografia: string): Promise<boolean> {
  if (!nome.trim()) throw new Error('O nome do autor nao pode ser vazio.');
  return await autorRepository.atualizarAutor(id, nome, biografia);
}

export async function excluirAutor(id: number): Promise<boolean> {
  return await autorRepository.excluirAutor(id);
}