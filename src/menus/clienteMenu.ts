import readline from 'readline';
import * as clienteController from '../controllers/clienteController.js';

export async function exibirMenuClientes(rl: readline.Interface): Promise<void> {
  while (true) {
    console.log('\n--- GERENCIAR CLIENTES ---');
    console.log('1. Cadastrar Cliente');
    console.log('2. Listar Clientes');
    console.log('3. Atualizar Cliente');
    console.log('4. Excluir Cliente');
    console.log('0. Voltar');

    const opcao = await new Promise<string>((resolve) => rl.question('Escolha uma opcao: ', resolve));

    if (opcao === '0') break;

    try {
      switch (opcao) {
        case '1': {
          const nome = await new Promise<string>((resolve) => rl.question('Nome: ', resolve));
          const email = await new Promise<string>((resolve) => rl.question('Email: ', resolve));
          const telefone = await new Promise<string>((resolve) => rl.question('Telefone: ', resolve));
          const cliente = await clienteController.cadastrar(nome, email, telefone || null);
          console.log(`Cliente cadastrado com sucesso! ID: ${cliente.id}`);
          break;
        }
        case '2': {
          const clientes = await clienteController.listar();
          if (clientes.length === 0) {
            console.log('Nenhum cliente cadastrado.');
          } else {
            console.log('\n--- LISTA DE CLIENTES ---');
            clientes.forEach((c) => console.log(`ID: ${c.id} | Nome: ${c.nome} | Email: ${c.email} | Telefone: ${c.telefone || 'N/A'}`));
          }
          break;
        }
        case '3': {
          const idStr = await new Promise<string>((resolve) => rl.question('ID do Cliente a atualizar: ', resolve));
          const nome = await new Promise<string>((resolve) => rl.question('Novo Nome: ', resolve));
          const email = await new Promise<string>((resolve) => rl.question('Novo Email: ', resolve));
          const telefone = await new Promise<string>((resolve) => rl.question('Novo Telefone: ', resolve));
          const atualizado = await clienteController.atualizar(Number(idStr), nome, email, telefone || null);
          if (atualizado) console.log('Cliente atualizado com sucesso!');
          else console.log('Cliente nao encontrado.');
          break;
        }
        case '4': {
          const idStr = await new Promise<string>((resolve) => rl.question('ID do Cliente a excluir: ', resolve));
          const excluido = await clienteController.excluir(Number(idStr));
          if (excluido) console.log('Cliente excluido com sucesso!');
          else console.log('Cliente nao encontrado.');
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