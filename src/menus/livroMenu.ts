import * as readlinePromises from 'readline/promises';
import * as livroController from '../controllers/livroController.js';

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
          const autorIdStr = await rl.question('ID do Autor: ');
          const qtdStr = await rl.question('Quantidade Disponivel: ');
          
          const livro = await livroController.cadastrar(
            titulo, 
            anoStr ? Number(anoStr) : null, 
            Number(autorIdStr), 
            Number(qtdStr)
          );
          console.log(`Livro cadastrado com sucesso! ID: ${livro.id}`);
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
          const idStr = await rl.question('ID do Livro a atualizar: ');
          const titulo = await rl.question('Novo Titulo: ');
          const anoStr = await rl.question('Novo Ano de Publicacao: ');
          const autorIdStr = await rl.question('Novo ID do Autor: ');
          const qtdStr = await rl.question('Nova Quantidade: ');
          
          const atualizado = await livroController.atualizar(
            Number(idStr), 
            titulo, 
            anoStr ? Number(anoStr) : null, 
            Number(autorIdStr), 
            Number(qtdStr)
          );
          if (atualizado) console.log('Livro atualizado com sucesso!');
          else console.log('Livro nao encontrado.');
          break;
        }
        case '4': {
          const idStr = await rl.question('ID do Livro a excluir: ');
          const excluido = await livroController.excluir(Number(idStr));
          if (excluido) console.log('Livro excluido com sucesso!');
          else console.log('Livro nao encontrado.');
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