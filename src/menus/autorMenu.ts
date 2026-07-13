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
          const nome = await rl.question('Nome: ');
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
          const idStr = await rl.question('ID do Autor a atualizar: ');
          const nome = await rl.question('Novo Nome: ');
          const biografia = await rl.question('Nova Biografia: ');
          const atualizado = await autorController.atualizar(Number(idStr), nome, biografia);
          if (atualizado) console.log('Autor atualizado com sucesso!');
          else console.log('Autor nao encontrado.');
          break;
        }
        case '4': {
          const idStr = await rl.question('ID do Autor a excluir: ');
          const excluido = await autorController.excluir(Number(idStr));
          if (excluido) console.log('Autor excluido com sucesso!');
          else console.log('Autor nao encontrado.');
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