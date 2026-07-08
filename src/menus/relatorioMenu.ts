import readline from 'readline/promises';
import * as relatorioService from '../services/relatorioService.js';

export async function exibirMenuRelatorios(rl: readline.Interface) {
  let emSubmenu = true;

  while (emSubmenu) {
    console.log('\n====================================');
    console.log('        RELATÓRIOS GERENCIAIS        ');
    console.log('====================================');
    console.log('1. Livros Mais Emprestados (Top 5)');
    console.log('2. Clientes Mais Ativos (Top 5)');
    console.log('3. Resumo de Status dos Empréstimos');
    console.log('0. Voltar ao Menu Principal');
    console.log('====================================');

    const opcao = await rl.question('Escolha uma opcao: ');

    switch (opcao) {
      case '1':
        try {
          const dados = await relatorioService.buscarLivrosMaisEmprestados();
          console.log('\n--- TOP 5 LIVROS MAIS EMPRESTADOS ---');
          if (dados.length === 0) console.log('Nenhum dado disponível.');
          dados.forEach((item, index) => {
            console.log(`${index + 1} - ${item.titulo} | Quantidade: ${item.quantidade}`);
          });
        } catch (error) {
          console.error('Erro ao gerar relatorio:', error);
        }
        break;

      case '2':
        try {
          const dados = await relatorioService.buscarClientesMaisAtivos();
          console.log('\n--- TOP 5 CLIENTES MAIS ATIVOS ---');
          if (dados.length === 0) console.log('Nenhum dado disponível.');
          dados.forEach((item, index) => {
            console.log(`${index + 1} - ${item.nome} | Quantidade: ${item.quantidade}`);
          });
        } catch (error) {
          console.error('Erro ao gerar relatorio:', error);
        }
        break;

      case '3':
        try {
          const dados = await relatorioService.buscarResumoStatus();
          console.log('\n--- RESUMO DE STATUS ---');
          if (dados.length === 0) console.log('Nenhum dado disponível.');
          dados.forEach(item => {
            console.log(`${item.status}: ${item.quantidade}`);
          });
        } catch (error) {
          console.error('Erro ao gerar relatorio:', error);
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