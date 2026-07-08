import readline from 'readline';
import * as emprestimoController from '../controllers/emprestimoController.js';

export async function exibirMenuEmprestimos(rl: readline.Interface): Promise<void> {
  while (true) {
    console.log('\n--- GERENCIAR EMPRESTIMOS ---');
    console.log('1. Realizar Emprestimo');
    console.log('2. Listar Emprestimos');
    console.log('3. Registrar Devolucao');
    console.log('0. Voltar');

    const opcao = await new Promise<string>((resolve) => rl.question('Escolha uma opcao: ', resolve));

    if (opcao === '0') break;

    try {
      switch (opcao) {
        case '1': {
          const clienteIdStr = await new Promise<string>((resolve) => rl.question('ID do Cliente: ', resolve));
          const livroIdStr = await new Promise<string>((resolve) => rl.question('ID do Livro: ', resolve));
          const emp = await emprestimoController.realizarEmprestimo(Number(clienteIdStr), Number(livroIdStr));
          console.log(`Emprestimo realizado com sucesso! ID: ${emp.id}`);
          break;
        }
        case '2': {
          const emprestimos = await emprestimoController.listar();
          if (emprestimos.length === 0) {
            console.log('Nenhum emprestimo registrado.');
          } else {
            console.log('\n--- LISTA DE EMPRESTIMOS ---');
            emprestimos.forEach((e: any) => {
              console.log(`ID: ${e.id} | Cliente: ${e.nome_cliente} | Livro: ${e.titulo_livro} | Data: ${e.data_emprestimo} | Devolucao: ${e.data_devolucao || 'Em aberto'}`);
            });
          }
          break;
        }
        case '3': {
          const idStr = await new Promise<string>((resolve) => rl.question('ID do Emprestimo a devolver: ', resolve));
          const devolvido = await emprestimoController.realizarDevolucao(Number(idStr));
          if (devolvido) console.log('Devolucao registrada com sucesso!');
          else console.log('Emprestimo nao encontrado ou ja devolvido.');
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