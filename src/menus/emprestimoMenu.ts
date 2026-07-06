import readline from 'readline/promises';
import { cadastrarEmprestimo, listarEmprestimos, registrarDevolucao } from '../repositories/emprestimoRepository.js';
import { listarClientes } from '../repositories/clienteRepository.js';
import { listarLivros } from '../repositories/livroRepository.js';

export async function exibirMenuEmprestimos(rl: readline.Interface) {
  let emSubmenu = true;

  while (emSubmenu) {
    console.log('\n====================================');
    console.log('      GERENCIAR EMPRÉSTIMOS         ');
    console.log('====================================');
    console.log('1. Registrar Empréstimo');
    console.log('2. Listar Empréstimos');
    console.log('3. Registrar Devolução');
    console.log('0. Voltar ao Menu Principal');
    console.log('====================================');

    const opcao = await rl.question('Escolha uma opcao: ');

    switch (opcao) {
      case '1':
        try {
          console.log('\n--- Novo Empréstimo ---');
          const clienteIdStr = await rl.question('ID do Cliente: ');
          const livroIdStr = await rl.question('ID do Livro: ');

          if (!clienteIdStr || !livroIdStr) {
            console.log('Erro: ID do Cliente e ID do Livro sao obrigatorios.');
            break;
          }

          const clienteId = Number(clienteIdStr);
          const livroId = Number(livroIdStr);

          const clientes = await listarClientes();
          const clienteExiste = clientes.some(c => c.id === clienteId);
          if (!clienteExiste) {
            console.log(`\nErro: Nao existe nenhum cliente com o ID [${clienteId}] no banco de dados.`);
            break;
          }

          const livros = await listarLivros();
          const livroExiste = livros.some(l => l.id === livroId);
          if (!livroExiste) {
            console.log(`\nErro: Nao existe nenhum livro com o ID [${livroId}] no banco de dados.`);
            break;
          }

          const novoEmprestimo = await cadastrarEmprestimo(clienteId, livroId);
          console.log(`\nEmpréstimo registrado com sucesso sob o ID ${novoEmprestimo.id}!`);

        } catch (error) {
          console.error('Erro ao registrar empréstimo:', error);
        }
        break;

      case '2':
        try {
          const emprestimos = await listarEmprestimos();
          console.log('\n--- Lista de Empréstimos ---');
          if (emprestimos.length === 0) {
            console.log('Nenhum empréstimo registrado.');
          } else {
            emprestimos.forEach(emp => {
              const status = emp.data_devolucao ? `Devolvido em: ${emp.data_devolucao}` : '📍 Em aberto';
              console.log(`ID: ${emp.id} | Cliente: ${emp.nome_cliente} (ID: ${emp.cliente_id})`);
              console.log(`   Livro: "${emp.titulo_livro}" (ID: ${emp.livro_id})`);
              console.log(`   Retirada: ${emp.data_emprestimo} | Status: ${status}`);
              console.log('------------------------------------');
            });
          }
        } catch (error) {
          console.error('Erro ao listar empréstimos:', error);
        }
        break;

      case '3':
        try {
          console.log('\n--- Registrar Devolução ---');
          const idDevolucao = await rl.question('Digite o ID do empréstimo que deseja dar baixa: ');

          if (!idDevolucao) {
            console.log('Erro: O ID do empréstimo é obrigatório.');
            break;
          }

          const devolvido = await registrarDevolucao(Number(idDevolucao));
          if (devolvido) {
            console.log('\nDevolução registrada com sucesso!');
          } else {
            console.log('\nErro: Empréstimo não encontrado ou já encerrado anteriormente.');
          }
        } catch (error) {
          console.error('Erro ao registrar devolução:', error);
        }
        break;

      case '0':
        emSubmenu = false;
        break;

      default:
        console.log('\nOpcao invalida! Tente novamente.');
    }
  }
}