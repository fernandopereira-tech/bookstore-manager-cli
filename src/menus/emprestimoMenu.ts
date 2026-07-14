import * as readlinePromises from 'readline/promises';
import * as emprestimoController from '../controllers/emprestimoController.js';
import * as clienteController from '../controllers/clienteController.js';
import * as livroController from '../controllers/livroController.js';

export async function exibirMenuEmprestimos(rl: readlinePromises.Interface): Promise<void> {
  while (true) {
    console.log('\n--- GERENCIAR EMPRESTIMOS ---');
    console.log('1. Realizar Emprestimo');
    console.log('2. Listar Emprestimos');
    console.log('3. Registrar Devolucao');
    console.log('0. Voltar');

    const opcao = await rl.question('Escolha uma opcao: ');

    if (opcao.trim() === '0') {
      break;
    }

    try {
      switch (opcao.trim()) {
        case '1': {
          let clienteIdStr = '';
          let cancelarCliente = false;
          while (true) {
            clienteIdStr = await rl.question('ID do Cliente (ou 0 para cancelar): ');
            if (clienteIdStr.trim() === '0') {
              cancelarCliente = true;
              break;
            }
            try {
              const clientes = await clienteController.listar();
              const clienteExiste = clientes.some((c) => c.id === Number(clienteIdStr));
              if (clienteExiste) {
                break;
              }
              console.log(`\n[ATENÇÃO] O cliente de ID "${clienteIdStr}" não foi encontrado no banco.`);
              console.log('Por favor, tente novamente.\n');
            } catch {
              break;
            }
          }

          if (cancelarCliente) {
            console.log('Operação cancelada.');
            break;
          }

          let livroIdStr = '';
          let cancelarLivro = false;
          while (true) {
            livroIdStr = await rl.question('ID do Livro (ou 0 para cancelar): ');
            if (livroIdStr.trim() === '0') {
              cancelarLivro = true;
              break;
            }
            try {
              const livros = await livroController.listar();
              const livro = livros.find((l) => l.id === Number(livroIdStr));
              if (!livro) {
                console.log(`\n[ATENÇÃO] O livro de ID "${livroIdStr}" não foi encontrado no banco.`);
                console.log('Por favor, tente novamente.\n');
                continue;
              }
              
              const qtd = livro.quantidade_disponivel ?? 0;
              if (qtd <= 0) {
                console.log(`\n[ATENÇÃO] O livro "${livro.titulo}" não possui estoque disponível no momento.`);
                console.log('Por favor, selecione outro livro.\n');
                continue;
              }
              break;
            } catch {
              break;
            }
          }

          if (cancelarLivro) {
            console.log('Operação cancelada.');
            break;
          }

          try {
            const emp = await emprestimoController.realizarEmprestimo(Number(clienteIdStr), Number(livroIdStr));
            console.log(`Emprestimo realizado com sucesso! ID: ${emp.id}`);
          } catch (error: any) {
            console.log(`\n[ATENÇÃO] Não foi possível realizar o empréstimo: ${error.message}\n`);
          }
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
          let idStr = '';
          let cancelar = false;
          while (true) {
            idStr = await rl.question('ID do Emprestimo a devolver (ou 0 para cancelar): ');
            if (idStr.trim() === '0') {
              cancelar = true;
              break;
            }
            try {
              const devolvido = await emprestimoController.realizarDevolucao(Number(idStr));
              if (devolvido) {
                console.log('Devolucao registrada com sucesso!');
                break;
              } else {
                console.log('\n[ATENÇÃO] Empréstimo não encontrado ou já devolvido.');
                console.log('Por favor, tente novamente.\n');
              }
            } catch (error: any) {
              console.log(`\n[ATENÇÃO] Erro ao processar devolução: ${error.message}\n`);
            }
          }
          
          if (cancelar) {
            console.log('Operação cancelada.');
          }
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