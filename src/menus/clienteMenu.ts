import readline from 'readline/promises';
import { cadastrarCliente, listarClientes, atualizarCliente, excluirCliente } from '../repositories/clienteRepository.js';

export async function exibirMenuClientes(rl: readline.Interface) {
  let emSubmenu = true;

  while (emSubmenu) {
    console.log('\n====================================');
    console.log('        GERENCIAR CLIENTES          ');
    console.log('====================================');
    console.log('1. Cadastrar Cliente');
    console.log('2. Listar Clientes');
    console.log('3. Atualizar Cliente');
    console.log('4. Excluir Cliente');
    console.log('0. Voltar ao Menu Principal');
    console.log('====================================');

    const opcao = await rl.question('Escolha uma opcao: ');

    switch (opcao) {
      case '1':
        try {
          console.log('\n--- Novo Cliente ---');
          const nome = await rl.question('Nome do Cliente: ');
          const email = await rl.question('E-mail: ');
          const telefone = await rl.question('Telefone (opcional): ');

          if (!nome || !email) {
            console.log('Erro: Nome e E-mail sao obrigatorios.');
            break;
          }

          const novoCliente = await cadastrarCliente(nome, email, telefone || null);
          console.log(`\nCliente [${novoCliente.nome}] cadastrado com sucesso com o ID ${novoCliente.id}!`);

        } catch (error: any) {
          if (error.code === '23505') {
            console.log('\nErro: Este e-mail ja esta cadastrado para outro cliente.');
          } else {
            console.error('Erro ao cadastrar cliente:', error);
          }
        }
        break;

      case '2':
        try {
          const clientes = await listarClientes();
          console.log('\n--- Lista de Clientes ---');
          if (clientes.length === 0) {
            console.log('Nenhum cliente cadastrado.');
          } else {
            clientes.forEach(cliente => {
              console.log(`ID: ${cliente.id} | Nome: ${cliente.nome} | E-mail: ${cliente.email} | Tel: ${cliente.telefone || 'N/A'}`);
            });
          }
          console.log('------------------------------------');
        } catch (error) {
          console.error('Erro ao listar clientes:', error);
        }
        break;

      case '3':
        try {
          console.log('\n--- Atualizar Cliente ---');
          const idAlterar = await rl.question('Digite o ID do cliente que deseja atualizar: ');
          const novoNome = await rl.question('Novo Nome: ');
          const novoEmail = await rl.question('Novo E-mail: ');
          const novoTelefone = await rl.question('Novo Telefone (opcional): ');

          if (!novoNome || !novoEmail) {
            console.log('Erro: Nome e E-mail nao podem ficar em branco.');
            break;
          }

          const atualizado = await atualizarCliente(Number(idAlterar), novoNome, novoEmail, novoTelefone || null);
          if (atualizado) {
            console.log('\nCliente atualizado com sucesso!');
          } else {
            console.log('\nErro: Cliente nao encontrado com o ID informado.');
          }
        } catch (error: any) {
          if (error.code === '23505') {
            console.log('\nErro: Nao foi possivel atualizar. Este e-mail ja esta em uso por outro cliente.');
          } else {
            console.error('Erro ao atualizar cliente:', error);
          }
        }
        break;

      case '4':
        try {
          console.log('\n--- Excluir Cliente ---');
          const idExcluir = await rl.question('Digite o ID do cliente que deseja excluir: ');
          const confirmacao = await rl.question(`Tem certeza que deseja excluir o cliente ID ${idExcluir}? (s/n): `);

          if (confirmacao.toLowerCase() === 's') {
            const excluido = await excluirCliente(Number(idExcluir));
            if (excluido) {
              console.log('\nCliente removido com sucesso!');
            } else {
              console.log('\nErro: Cliente nao encontrado com o ID informado.');
            }
          } else {
            console.log('\nExclusao cancelada.');
          }
        } catch (error) {
          console.error('Erro ao excluir cliente:', error);
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