export interface Emprestimo {
  id?: number;
  cliente_id: number;
  livro_id: number;
  data_emprestimo?: Date | string;
  data_devolucao?: Date | string | null;
  nome_cliente?: string;
  titulo_livro?: string;
}