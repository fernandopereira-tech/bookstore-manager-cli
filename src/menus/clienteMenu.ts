import * as readlinePromises from 'readline/promises';
import * as clienteController from '../controllers/clienteController.js';

export async function exibirMenuClientes(rl: readlinePromises.Interface): Promise<void> {
  while (true) {
    console.log('\n--- GERENCIAR CLIENTES ---');
    console.log('1. Cadastrar Cliente');
    console.log('2. Listar Clientes');
    console.log('3. Atualizar Cliente');
    console.log('4. Excluir Cliente');
    console.log('0. Voltar');

    const opcao = await rl.question('Escolha uma opcao: ');

    if (opcao.trim() === '0') {
      break;
    }

    try {
      switch (opcao.trim()) {
        case '1': {
          const nome = await rl.question('Nome: ');
          let email = '';
          let cancelar = false;
          let primeiraTentativa = true;

          while (true) {
            const promptTexto = primeiraTentativa ? 'Email: ' : 'Email (ou 0 para cancelar): ';
            email = await rl.question(promptTexto);
            const emailFormatado = email.trim();

            if (!primeiraTentativa && emailFormatado === '0') {
              cancelar = true;
              break;
            }

            if (!emailFormatado.includes('@')) {
              console.log('\n[ATENÇÃO] E-mail inválido! O e-mail precisa conter um "@" (exemplo: usuario@provedor.com).');
              console.log('Por favor, tente novamente.\n');
              primeiraTentativa = false;
              continue;
            }

            const clientes = await clienteController.listar();
            const emailDuplicado = clientes.some(
              (c) => c.email.toLowerCase() === emailFormatado.toLowerCase()
            );

            if (emailDuplicado) {
              console.log('\n[ATENÇÃO] Não foi possível concluir: Email já cadastrado.');
              console.log('Por favor, tente novamente.\n');
              primeiraTentativa = false;
              continue;
            }

            email = emailFormatado;
            break;
          }

          if (cancelar) {
            console.log('Cadastro cancelado pelo usuário.');
            break;
          }

          const telefone = await rl.question('Telefone: ');
          
          try {
            const cliente = await clienteController.cadastrar(nome, email, telefone || null);
            console.log(`Cliente cadastrado com sucesso! ID: ${cliente.id}`);
          } catch (error: any) {
            if (error.message.toLowerCase().includes('cadastrado') || error.message.toLowerCase().includes('duplicado')) {
              console.log(`\n[ATENÇÃO] Não foi possível concluir: ${error.message}`);
              console.log('Por favor, refaça a operação de cadastro com dados válidos.');
            } else {
              throw error;
            }
          }
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
          let idStr = '';
          let cancelar = false;
          while (true) {
            idStr = await rl.question('ID do Cliente a atualizar (ou 0 para cancelar): ');
            if (idStr.trim() === '0') {
              cancelar = true;
              break;
            }
            const clientes = await clienteController.listar();
            const clienteExiste = clientes.some((c) => c.id === Number(idStr));
            if (clienteExiste) {
              break;
            }
            console.log(`\n[ATENÇÃO] Cliente com ID "${idStr}" não encontrado.`);
            console.log('Por favor, digite um ID de cliente válido.\n');
          }

          if (cancelar) {
            console.log('Operação cancelada.');
            break;
          }

          const nome = await rl.question('Novo Nome: ');
          
          let email = '';
          let primeiraTentativa = true;
          while (true) {
            const promptTexto = primeiraTentativa ? 'Novo Email: ' : 'Novo Email (ou 0 para cancelar): ';
            email = await rl.question(promptTexto);
            const emailFormatado = email.trim();

            if (!primeiraTentativa && emailFormatado === '0') {
              cancelar = true;
              break;
            }

            if (!emailFormatado.includes('@')) {
              console.log('\n[ATENÇÃO] E-mail inválido! O e-mail precisa conter um "@" (exemplo: usuario@provedor.com).');
              console.log('Por favor, tente novamente.\n');
              primeiraTentativa = false;
              continue;
            }

            const clientes = await clienteController.listar();
            const emailDuplicado = clientes.some(
              (c) => c.email.toLowerCase() === emailFormatado.toLowerCase() && c.id !== Number(idStr)
            );

            if (emailDuplicado) {
              console.log('\n[ATENÇÃO] Não foi possível concluir: Email já cadastrado por outro cliente.');
              console.log('Por favor, tente novamente.\n');
              primeiraTentativa = false;
              continue;
            }

            email = emailFormatado;
            break;
          }

          if (cancelar) {
            console.log('Operação cancelada.');
            break;
          }

          const telefone = await rl.question('Novo Telefone: ');
          try {
            const atualizado = await clienteController.atualizar(Number(idStr), nome, email, telefone || null);
            if (atualizado) {
              console.log('Cliente atualizado com sucesso!');
            }
          } catch (error: any) {
            if (error.message.toLowerCase().includes('cadastrado') || error.message.toLowerCase().includes('duplicado')) {
              console.log(`\n[ATENÇÃO] Não foi possível atualizar: ${error.message}`);
              console.log('Por favor, refaça a operação com dados válidos.');
            } else {
              throw error;
            }
          }
          break;
        }
        case '4': {
          let idStr = '';
          let cancelar = false;
          while (true) {
            idStr = await rl.question('ID do Cliente a excluir (ou 0 para cancelar): ');
            if (idStr.trim() === '0') {
              cancelar = true;
              break;
            }
            const clientes = await clienteController.listar();
            const clienteExiste = clientes.some((c) => c.id === Number(idStr));
            if (clienteExiste) {
              break;
            }
            console.log(`\n[ATENÇÃO] Cliente com ID "${idStr}" não encontrado.`);
            console.log('Por favor, digite um ID de cliente válido.\n');
          }

          if (cancelar) {
            console.log('Operação cancelada.');
            break;
          }

          const excluido = await clienteController.excluir(Number(idStr));
          if (excluido) console.log('Cliente excluido com sucesso!');
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