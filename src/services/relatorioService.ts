import * as relatorioRepository from '../repositories/relatorioRepository.js';
import { RelatorioLivro, RelatorioCliente, RelatorioStatus } from '../models/relatorio.js';

export async function buscarLivrosMaisEmprestados(): Promise<RelatorioLivro[]> {
  return await relatorioRepository.obterLivrosMaisEmprestados();
}

export async function buscarClientesMaisAtivos(): Promise<RelatorioCliente[]> {
  return await relatorioRepository.obterClientesMaisAtivos();
}

export async function buscarResumoStatus(): Promise<RelatorioStatus[]> {
  return await relatorioRepository.obterResumoStatus();
}