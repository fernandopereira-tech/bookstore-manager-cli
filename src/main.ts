import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { testConnection, pool } from './database/connection.js';
import { exibirMenuAutores } from './menus/autorMenu.js';
import { exibirMenuLivros } from './menus/livroMenu.js';
import { exibirMenuClientes } from './menus/clienteMenu.js';
import { exibirMenuEmprestimos } from './menus/emprestimoMenu.js';
import { exibirMenuRelatorios } from './menus/relatorioMenu.js';

const rl = readline.createInterface({ input, output });

async function main() {
  console.log('Iniciando o sistema BookStore Manager...');

  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('Nao foi possivel iniciar o sistema sem conexao com o banco de dados.');
    rl.close();
    process.exit(1);
  }

  console.log('Banco de dados conectado com sucesso!\n');

  let sistemaAtivo = true;

  while (sistemaAtivo) {
    console.log('====================================');
    console.log('      BOOKSTORE MANAGER - CLI       ');
    console.log('====================================');
    console.log('1. Gerenciar Autores');
    console.log('2. Gerenciar Livros');
    console.log('3. Gerenciar Clientes');
    console.log('4. Gerenciar Emprestimos');
    console.log('5. Relatorios Gerenciais');
    console.log('0. Sair do Sistema');
    console.log('====================================');

    const opcao = await rl.question('Escolha uma opcao: ');

    switch (opcao) {
      case '1':
        await exibirMenuAutores(rl);
        break;
      case '2':
        await exibirMenuLivros(rl);
        break;;
      case '3':
        await exibirMenuClientes(rl);
        break;
      case '4':
        await exibirMenuEmprestimos(rl);
        break;
      case '5':
        await exibirMenuRelatorios(rl);
        break;
      case '0':
        console.log('\nEncerrando o sistema. Ate logo!');
        sistemaAtivo = false;
        break;
      default:
        console.log('\nOpcao invalida! Tente novamente.\n');
    }
  }

  rl.close();
  await pool.end();
}

main();