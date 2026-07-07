import * as clienteRepository from '../repositories/clienteRepository.js';
import { Cliente } from '../models/cliente.js';

export async function registrarCliente(nome: string, email: string, telefone: string | null): Promise<Cliente> {
  const emailExistente = await clienteRepository.buscarClientePorEmail(email);
  if (emailExistente) {
    throw new Error(`Erro: O e-mail [${email}] já está cadastrado para outro cliente.`);
  }

  return await clienteRepository.cadastrarCliente(nome, email, telefone);
}