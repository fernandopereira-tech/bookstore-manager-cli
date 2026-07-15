import * as readlinePromises from 'readline/promises';
import * as autorController from '../controllers/autorController.js';

export async function exibirMenuAutores(rl: readlinePromises.Interface): Promise<void> {
  while (true) {
    console.log('\n--- GERENCIAR AUTORES ---');
    console.log('1. Cadastrar Autor');
    console.log('2. Listar Autores');
    console.log('3. Atualizar Autor');
    console.log('4. Excluir Autor');
    console.log('0. Voltar');

    const opcao = await rl.question('Escolha uma opcao: ');

    if (opcao.trim() === '0') {
      break;
    }

    try {
      switch (opcao.trim()) {
        case '1': {
          let nome = '';
          let cancelar = false;
          let primeiraTentativa = true;

          while (true) {
            const promptTexto = primeiraTentativa ? 'Nome: ' : 'Nome (ou 0 para cancelar): ';
            nome = await rl.question(promptTexto);
            const nomeFormatado = nome.trim();

            if (!primeiraTentativa && nomeFormatado === '0') {
              cancelar = true;
              break;
            }

            if (!nomeFormatado) {
              console.log('\n[ATENÇÃO] O nome do autor não pode ser vazio.');
              console.log('Por favor, tente novamente.\n');
              primeiraTentativa = false;
              continue;
            }

            const autores = await autorController.listar();
            const autorDuplicado = autores.some(
              (a) => a.nome.toLowerCase() === nomeFormatado.toLowerCase()
            );

            if (autorDuplicado) {
              console.log('\n[ATENÇÃO] Autor já cadastrado com este nome!');
              console.log('Por favor, tente novamente.\n');
              primeiraTentativa = false;
              continue;
            }

            nome = nomeFormatado;
            break;
          }

          if (cancelar) {
            console.log('Cadastro cancelado pelo usuário.');
            break;
          }

          const biografia = await rl.question('Biografia: ');
          const autor = await autorController.cadastrar(nome, biografia);
          console.log(`Autor cadastrado com sucesso! ID: ${autor.id}`);
          break;
        }
        case '2': {
          const autores = await autorController.listar();
          if (autores.length === 0) {
            console.log('Nenhum autor cadastrado.');
          } else {
            console.log('\n--- LISTA DE AUTORES ---');
            autores.forEach((a) => console.log(`ID: ${a.id} | Nome: ${a.nome} | Biografia: ${a.biografia || 'N/A'}`));
          }
          break;
        }
        case '3': {
          let idStr = '';
          let cancelar = false;
          while (true) {
            idStr = await rl.question('ID do Autor a atualizar (ou 0 para cancelar): ');
            if (idStr.trim() === '0') {
              cancelar = true;
              break;
            }
            const autores = await autorController.listar();
            const autorExiste = autores.some((a) => a.id === Number(idStr));
            if (autorExiste) {
              break;
            }
            console.log(`\n[ATENÇÃO] Autor com ID "${idStr}" não encontrado.`);
            console.log('Por favor, digite um ID de autor válido.\n');
          }

          if (cancelar) {
            console.log('Operação cancelada.');
            break;
          }

          const nome = await rl.question('Novo Nome: ');
          const biografia = await rl.question('Nova Biografia: ');
          const atualizado = await autorController.atualizar(Number(idStr), nome, biografia);
          if (atualizado) console.log('Autor updated com sucesso!');
          break;
        }
        case '4': {
          let idStr = '';
          let cancelar = false;
          while (true) {
            idStr = await rl.question('ID do Autor a excluir (ou 0 para cancelar): ');
            if (idStr.trim() === '0') {
              cancelar = true;
              break;
            }
            const autores = await autorController.listar();
            const autorExiste = autores.some((a) => a.id === Number(idStr));
            if (autorExiste) {
              break;
            }
            console.log(`\n[ATENÇÃO] Autor com ID "${idStr}" não encontrado.`);
            console.log('Por favor, digite um ID de autor válido.\n');
          }

          if (cancelar) {
            console.log('Operação cancelada.');
            break;
          }

          const excluido = await autorController.excluir(Number(idStr));
          if (excluido) console.log('Autor excluido com sucesso!');
          break;
        }
        default:
          console.log('Opcao invalida!');
      }
    } catch (error: any) {
      console.error(`Erro: ${error.message}`);
    }
  }
}