import * as readlinePromises from 'readline/promises';
import * as livroController from '../controllers/livroController.js';
import * as autorController from '../controllers/autorController.js';

export async function exibirMenuLivros(rl: readlinePromises.Interface): Promise<void> {
  while (true) {
    console.log('\n--- GERENCIAR LIVROS ---');
    console.log('1. Cadastrar Livro');
    console.log('2. Listar Livros');
    console.log('3. Atualizar Livro');
    console.log('4. Excluir Livro');
    console.log('0. Voltar');

    const opcao = await rl.question('Escolha uma opcao: ');

    if (opcao.trim() === '0') {
      break;
    }

    try {
      switch (opcao.trim()) {
        case '1': {
          const titulo = await rl.question('Titulo: ');
          const anoStr = await rl.question('Ano de Publicacao: ');
          
          let autorIdStr = '';
          let cancelar = false;
          while (true) {
            autorIdStr = await rl.question('ID do Autor (ou 0 para cancelar): ');
            if (autorIdStr.trim() === '0') {
              cancelar = true;
              break;
            }
            const autores = await autorController.listar();
            const autorExiste = autores.some((a) => a.id === Number(autorIdStr));
            if (autorExiste) {
              break;
            }
            console.log(`\n[ATENÇÃO] Autor com ID "${autorIdStr}" não encontrado.`);
            console.log('Por favor, insira um ID de autor cadastrado.\n');
          }

          if (cancelar) {
            console.log('Operação cancelada.');
            break;
          }

          const qtdStr = await rl.question('Quantidade Disponivel: ');
          
          try {
            const livro = await livroController.cadastrar(
              titulo, 
              anoStr ? Number(anoStr) : null, 
              Number(autorIdStr), 
              Number(qtdStr)
            );
            console.log(`Livro cadastrado com sucesso! ID: ${livro.id}`);
          } catch (error: any) {
            console.log(`\n[ATENÇÃO] Erro ao salvar: ${error.message}\n`);
          }
          break;
        }
        case '2': {
          const livros = await livroController.listar();
          if (livros.length === 0) {
            console.log('Nenhum livro cadastrado.');
          } else {
            console.log('\n--- LISTA DE LIVROS ---');
            livros.forEach((l: any) => 
              console.log(`ID: ${l.id} | Titulo: ${l.titulo} | Autor: ${l.nome_autor || l.autor_id} | Qtd: ${l.quantidade_disponivel}`)
            );
          }
          break;
        }
        case '3': {
          let idStr = '';
          let cancelarId = false;
          while (true) {
            idStr = await rl.question('ID do Livro a atualizar (ou 0 para cancelar): ');
            if (idStr.trim() === '0') {
              cancelarId = true;
              break;
            }
            const livros = await livroController.listar();
            const livroExiste = livros.some((l) => l.id === Number(idStr));
            if (livroExiste) {
              break;
            }
            console.log(`\n[ATENÇÃO] Livro com ID "${idStr}" não encontrado.`);
            console.log('Por favor, digite um ID de livro válido.\n');
          }

          if (cancelarId) {
            console.log('Operação cancelada.');
            break;
          }

          const titulo = await rl.question('Novo Titulo: ');
          const anoStr = await rl.question('Novo Ano de Publicacao: ');
          
          let autorIdStr = '';
          let cancelarAutor = false;
          while (true) {
            autorIdStr = await rl.question('Novo ID do Autor (ou 0 para cancelar): ');
            if (autorIdStr.trim() === '0') {
              cancelarAutor = true;
              break;
            }
            const autores = await autorController.listar();
            const autorExiste = autores.some((a) => a.id === Number(autorIdStr));
            if (autorExiste) {
              break;
            }
            console.log(`\n[ATENÇÃO] Autor com ID "${autorIdStr}" não encontrado.`);
            console.log('Por favor, insira um ID de autor cadastrado.\n');
          }

          if (cancelarAutor) {
            console.log('Operação cancelada.');
            break;
          }

          const qtdStr = await rl.question('Nova Quantidade: ');
          
          try {
            const atualizado = await livroController.atualizar(
              Number(idStr), 
              titulo, 
              anoStr ? Number(anoStr) : null, 
              Number(autorIdStr), 
              Number(qtdStr)
            );
            if (atualizado) console.log('Livro updated com sucesso!');
          } catch (error: any) {
            console.log(`\n[ATENÇÃO] Não foi possível atualizar o livro: ${error.message}\n`);
          }
          break;
        }
        case '4': {
          let idStr = '';
          let cancelar = false;
          while (true) {
            idStr = await rl.question('ID do Livro a excluir (ou 0 para cancelar): ');
            if (idStr.trim() === '0') {
              cancelar = true;
              break;
            }
            const livros = await livroController.listar();
            const livroExiste = livros.some((l) => l.id === Number(idStr));
            if (livroExiste) {
              break;
            }
            console.log(`\n[ATENÇÃO] Livro com ID "${idStr}" não encontrado.`);
            console.log('Por favor, digite um ID de livro válido.\n');
          }

          if (cancelar) {
            console.log('Operação cancelada.');
            break;
          }

          const excluido = await livroController.excluir(Number(idStr));
          if (excluido) console.log('Livro excluido com sucesso!');
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