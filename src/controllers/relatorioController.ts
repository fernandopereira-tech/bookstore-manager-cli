import * as relatorioService from '../services/relatorioService.js';

export async function buscarLivrosDisponiveis(): Promise<any[]> {
  return await relatorioService.buscarLivrosDisponiveis();
}

export async function buscarLivrosEmprestados(): Promise<any[]> {
  return await relatorioService.buscarLivrosEmprestados();
}

export async function buscarLivrosPorAutor(): Promise<any[]> {
  return await relatorioService.buscarLivrosPorAutor();
}

export async function buscarQuantidadeEmprestimosPorLivro(): Promise<any[]> {
  return await relatorioService.buscarQuantidadeEmprestimosPorLivro();
}

export async function buscarClientesComEmprestimosAtivos(): Promise<any[]> {
  return await relatorioService.buscarClientesComEmprestimosAtivos();
}