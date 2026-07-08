import readline from 'readline/promises';
import * as livroService from '../services/livroService.js';
import { listarLivros, excluirLivro } from '../repositories/livroRepository.js';
import { listarAutores } from '../repositories/autorRepository.js';

export async function exibirMenuLivros(rl: readline.Interface) {
  let emSubmenu = true;

  while (emSubmenu) {
    console.log('\n====================================');
    console.log('        GERENCIAR LIVROS            ');
    console.log('====================================');
    console.log('1. Cadastrar Livro');
    console.log('2. Listar Livros');
    console.log('3. Atualizar Livro');
    console.log('4. Excluir Livro');
    console.log('0. Voltar ao Menu Principal');
    console.log('====================================');

    const opcao = await rl.question('Escolha uma opcao: ');

    switch (opcao) {
      case '1':
        try {
          console.log('\n--- Novo Livro ---');
          const titulo = await rl.question('Titulo do Livro: ');
          const anoStr = await rl.question('Ano de Publicacao (opcional): ');
          const autorIdStr = await rl.question('ID do Autor: ');
          const qtdStr = await rl.question('Quantidade em Estoque Inicial: ');

          if (!titulo || !autorIdStr || !qtdStr) {
            console.log('Erro: Titulo, ID do Autor e Quantidade sao obrigatorios.');
            break;
          }

          const autorId = Number(autorIdStr);
          const anoPublicacao = anoStr ? Number(anoStr) : null;
          const quantidadeDisponivel = Number(qtdStr);

          const autoresExistentes = await listarAutores();
          const autorExiste = autoresExistentes.some(autor => autor.id === autorId);

          if (!autorExiste) {
            console.log(`\nErro: Nao existe nenhum autor com o ID [${autorId}] no banco de dados.`);
            console.log('Cadastre o autor primeiro no menu correspondente antes de vincular o livro.');
            break;
          }

          const novoLivro = await livroService.registrarLivro(titulo, anoPublicacao, autorId, quantidadeDisponivel);
          console.log(`\nLivro [${novoLivro.titulo}] cadastrado com sucesso com o ID ${novoLivro.id}!`);
        } catch (error: any) {
          console.log(`\n${error.message}`);
        }
        break;

      case '2':
        try {
          const livros = await listarLivros();
          console.log('\n--- Lista de Livros (com Autores) ---');
          if (livros.length === 0) {
            console.log('Nenhum livro cadastrado.');
          } else {
            livros.forEach(livro => {
              console.log(`ID: ${livro.id} | Titulo: "${livro.titulo}" | Estoque: ${livro.quantidade_disponivel ?? 0}`);
              console.log(`   Ano: ${livro.ano_publicacao || 'N/A'} | Autor: ${livro.nome_autor} (ID: ${livro.autor_id})`);
              console.log('------------------------------------');
            });
          }
        } catch (error) {
          console.error('Erro ao listar livros:', error);
        }
        break;

      case '3':
        try {
          console.log('\n--- Mudança de Dados do Livro ---');
          const idAlterar = await rl.question('Digite o ID do livro que deseja atualizar: ');
          const novoTitulo = await rl.question('Novo Titulo: ');
          const novoAnoStr = await rl.question('Novo Ano de Publicacao (opcional): ');
          const novoAutorIdStr = await rl.question('Novo ID do Autor: ');
          const novaQtdStr = await rl.question('Nova Quantidade em Estoque: ');

          if (!novoTitulo || !novoAutorIdStr || !novaQtdStr) {
            console.log('Erro: Titulo, ID do Autor e Quantidade nao podem ficar em branco.');
            break;
          }

          const novoAutorId = Number(novoAutorIdStr);
          const novoAno = novoAnoStr ? Number(novoAnoStr) : null;
          const novaQuantidade = Number(novaQtdStr);

          const autoresExistentes = await listarAutores();
          const autorExiste = autoresExistentes.some(autor => autor.id === novoAutorId);

          if (!autorExiste) {
            console.log(`\nErro: Nao existe nenhum autor com o ID [${novoAutorId}] no banco de dados. Atualizacao abortada.`);
            break;
          }

          const atualizado = await livroService.modificarLivro(Number(idAlterar), novoTitulo, novoAno, novoAutorId, novaQuantidade);
          if (atualizado) {
            console.log('\nLivro atualizado com sucesso!');
          } else {
            console.log('\nErro: Livro nao encontrado com o ID informado.');
          }
        } catch (error: any) {
          console.log(`\n${error.message}`);
        }
        break;

      case '4':
        try {
          console.log('\n--- Excluir Livro ---');
          const idExcluir = await rl.question('Digite o ID do livro que deseja excluir: ');
          const confirmacao = await rl.question(`Tem certeza que deseja excluir o livro ID ${idExcluir}? (s/n): `);

          if (confirmacao.toLowerCase() === 's') {
            const excluido = await excluirLivro(Number(idExcluir));
            if (excluido) {
              console.log('\nLivro removido com sucesso!');
            } else {
              console.log('\nErro: Livro nao encontrado com o ID informado.');
            }
          } else {
            console.log('\nExclusao cancelada.');
          }
        } catch (error) {
          console.error('Erro ao excluir livro:', error);
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