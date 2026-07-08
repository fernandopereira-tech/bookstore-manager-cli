import * as autorRepository from '../repositories/autorRepository.js';
import { Autor } from '../models/autor.js';

export async function registrarAutor(nome: string, biografia: string): Promise<Autor> {
    if (!nome || nome.trim() === '') {
        throw new Error("Erro: O nome do autor é obrigatório e não pode conter apenas espaços.");
    }

    return await autorRepository.cadastrarAutor(nome.trim(), biografia);
}

export async function modificarAutor(id: number, nome: string, biografia: string): Promise<boolean> {
    if (!nome || nome.trim() === '') {
        throw new Error("Erro: O nome do autor não pode ficar em branco.");
    }

    const autorExistente = await autorRepository.buscarAutorPorId(id);
    if (!autorExistente) {
        return false;
    }

    return await autorRepository.atualizarAutor(id, nome.trim(), biografia);
}