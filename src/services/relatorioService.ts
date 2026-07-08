import * as relatorioRepository from '../repositories/relatorioRepository.js';

export async function buscarLivrosDisponiveis(): Promise<any[]> {
  return await relatorioRepository.obterLivrosDisponiveis();
}

export async function buscarLivrosEmprestados(): Promise<any[]> {
  return await relatorioRepository.obterLivrosEmprestados();
}

export async function buscarLivrosPorAutor(): Promise<any[]> {
  return await relatorioRepository.obterLivrosPorAutor();
}

export async function buscarQuantidadeEmprestimosPorLivro(): Promise<any[]> {
  return await relatorioRepository.obterQuantidadeEmprestimosPorLivro();
}

export async function buscarClientesComEmprestimosAtivos(): Promise<any[]> {
  return await relatorioRepository.obterClientesComEmprestimosAtivos();
}