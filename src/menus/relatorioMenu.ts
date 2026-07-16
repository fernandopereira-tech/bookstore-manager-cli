import * as readlinePromises from 'readline/promises';
import * as relatorioController from '../controllers/relatorioController.js';

export async function exibirMenuRelatorios(rl: readlinePromises.Interface): Promise<void> {
  while (true) {
    console.log('\n--- RELATORIOS GERENCIAIS ---');
    console.log('1. Listar Livros Disponiveis');
    console.log('2. Listar Livros Emprestados (Ativos)');
    console.log('3. Quantidade de Livros Cadastrados por Autor');
    console.log('4. Quantidade de Emprestimos por Livro (Historico)');
    console.log('5. Listar Clientes com Emprestimos Ativos');
    console.log('0. Voltar');

    const opcao = await rl.question('Escolha uma opcao: ');

    if (opcao.trim() === '0') {
      break;
    }

    try {
      switch (opcao.trim()) {
        case '1': {
          const dados = await relatorioController.buscarLivrosDisponiveis();
          console.log('\n--- LIVROS DISPONIVEIS ---');
          if (dados.length === 0) console.log('Nenhum livro disponivel no estoque.');
          dados.forEach((item) => console.log(`ID: ${item.id} | Titulo: ${item.titulo} | Qtd: ${item.quantidade_disponivel}`));
          break;
        }
        case '2': {
          const dados = await relatorioController.buscarLivrosEmprestados();
          console.log('\n--- LIVROS ATUALMENTE EMPRESTADOS ---');
          if (dados.length === 0) console.log('Nenhum livro emprestado no momento.');
          dados.forEach((item) => console.log(`ID: ${item.id} | Titulo: ${item.titulo}`));
          break;
        }
        case '3': {
          const dados = await relatorioController.buscarLivrosPorAutor();
          console.log('\n--- LIVROS CADASTRADOS POR AUTOR ---');
          dados.forEach((item) => console.log(`Autor: ${item.autor} | Livros Cadastrados: ${item.quantidade}`));
          break;
        }
        case '4': {
          const dados = await relatorioController.buscarQuantidadeEmprestimosPorLivro();
          console.log('\n--- QUANTIDADE DE EMPRESTIMOS POR LIVRO ---');
          dados.forEach((item) => console.log(`Livro: ${item.titulo} | Total de Emprestimos: ${item.quantidade}`));
          break;
        }
        case '5': {
          const dados = await relatorioController.buscarClientesComEmprestimosAtivos();
          console.log('\n--- CLIENTES COM EMPRESTIMOS ATIVOS ---');
          if (dados.length === 0) console.log('Nenhum cliente com emprestimo em aberto.');
          dados.forEach((item) => console.log(`ID: ${item.id} | Nome: ${item.nome} | Email: ${item.email}`));
          break;
        }
        default:
          console.log('Opcao invalida!');
      }
    } catch (error: any) {
      console.error(`Erro ao gerar relatorio: ${error.message}`);
    }
  }
}