export interface Emprestimo {
    id?: number;
    cliente_id: number;
    libro_id: number; // mantendo o padrão de escrita do seu banco
    data_emprestimo?: Date;
    data_devolucao?: Date | null;
}
