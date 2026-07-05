import { cadastrarAutor, listarAutores, atualizarAutor, excluirAutor } from '../repositories/autorRepository.js';
import readline from 'readline/promises';

export async function exibirMenuAutores(rl: readline.Interface) {
  let emSubmenu = true;

  while (emSubmenu) {
    console.log('\n====================================');
    console.log('       GERENCIAR AUTORES            ');
    console.log('====================================');
    console.log('1. Cadastrar Autor');
    console.log('2. Listar Autores');
    console.log('3. Atualizar Autor');
    console.log('4. Excluir Autor');
    console.log('0. Voltar ao Menu Principal');
    console.log('====================================');

    const opcao = await rl.question('Escolha uma opcao: ');

    switch (opcao) {
      case '1':
        const nome = await rl.question('\nNome do Autor: ');
        const biografia = await rl.question('Biografia: ');
        
        if (!nome) {
          console.log('Erro: O nome do autor é obrigatório.');
          break;
        }

        try {
          const novoAutor = await cadastrarAutor(nome, biografia);
          console.log(`\nAutor [${novoAutor.nome}] cadastrado com sucesso com o ID ${novoAutor.id}!`);
        } catch (error) {
          console.error('Erro ao cadastrar autor:', error);
        }
        break;

      case '2':
        try {
          const autores = await listarAutores();
          console.log('\n--- Lista de Autores ---');
          if (autores.length === 0) {
            console.log('Nenhum autor cadastrado.');
          } else {
            autores.forEach(autor => {
              console.log(`ID: ${autor.id} | Nome: ${autor.nome} | Bio: ${autor.biografia || 'Sem biografia'}`);
            });
          }
          console.log('------------------------');
        } catch (error) {
          console.error('Erro ao listar autores:', error);
        }
        break;

      case '3':
        try {
          const idAlterar = await rl.question('\nDigite o ID do autor que deseja atualizar: ');
          const novoNome = await rl.question('Novo Nome: ');
          const novaBio = await rl.question('Nova Biografia: ');

          if (!novoNome) {
            console.log('Erro: O nome do autor não pode ficar em branco.');
            break;
          }

          const atualizado = await atualizarAutor(Number(idAlterar), novoNome, novaBio);
          if (atualizado) {
            console.log('\nAutor atualizado com sucesso!');
          } else {
            console.log('\nErro: Autor não encontrado com o ID informado.');
          }
        } catch (error) {
          console.error('Erro ao atualizar autor:', error);
        }
        break;

      case '4':
        try {
          const idExcluir = await rl.question('\nDigite o ID do autor que deseja excluir: ');
          const confirmacao = await rl.question(`Tem certeza que deseja excluir o autor ID ${idExcluir}? (s/n): `);

          if (confirmacao.toLowerCase() === 's') {
            const excluido = await excluirAutor(Number(idExcluir));
            if (excluido) {
              console.log('\nAutor removido com sucesso!');
            } else {
              console.log('\nErro: Autor não encontrado com o ID informado.');
            }
          } else {
            console.log('\nExclusao cancelada.');
          }
        } catch (error) {
          console.error('Erro ao excluir autor:', error);
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