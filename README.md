# BookStore Manager - CLI de Referência em Node + TypeScript

## Objetivo e restrições

Desenvolvi este projeto como um aplicativo interativo de linha de comando (CLI) voltado para o gerenciamento de uma livraria/biblioteca (controlando fluxos de autores, livros, clientes e empréstimos). Construí este software como um exemplo de referência arquitetural: meu objetivo principal foi modelar um desenho limpo, modular e robusto, aplicando boas práticas de engenharia de software e padrões reais de mercado.

Três grandes restrições e guias moldaram minhas decisões:
1. **TypeScript sobre Node.js:** Uso total do ecossistema moderno com forte tipagem e compilação via `tsc`, utilizando drivers nativos para comunicação de infraestrutura.
2. **Desenvolvimento em Camadas Estritas:** Separação rígida de responsabilidades, garantindo que o acoplamento seja controlado e que componentes de infraestrutura (banco de dados) possam ser substituídos sem impactar o core do negócio.
3. **Tratamento de Exceções de Domínio:** Bloqueio e blindagem contra falhas técnicas expostas diretamente na interface, garantindo tratamento de erros em nível de negócio antes que alcancem o banco de dados.

---

## Como rodar

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Compilar o TypeScript para JavaScript (Build)
npm run build

# 3. Iniciar o aplicativo CLI
npm start

```

### Variáveis de Ambiente

O aplicativo se conecta a um banco de dados relacional. Configurei um arquivo `.env` na raiz do projeto contendo as credenciais do meu ambiente PostgreSQL:

```env
DB_USER=seu_usuario
DB_HOST=seu_host
DB_DATABASE=bookstore
DB_PASSWORD=sua_senha
DB_PORT=5432

```

### Lições Aprendidas: O problema do `run dev` vs. Estratégia de Compilação

Durante o desenvolvimento, observei que o uso de ferramentas de execução direta (como scripts de `dev` baseados em executores em tempo de execução que ignoram a checagem estrita ou que entram em conflito com módulos ES no ecossistema misto) pode mascarar inconsistências de tipos ou falhas de resolução de caminhos (`path mappings`) em módulos TypeScript compilados com a extensão `.js` nos imports.

Para garantir **zero erros** e total previsibilidade em produção, adotei a estratégia clássica e mais segura do ecossistema:

1. **Compilação Estrita (`npm run build`):** Invoco o compilador oficial do TypeScript (`tsc`). Se houver qualquer inconsistência de tipagem ou arquivo ausente, o processo falha imediatamente, impedindo que o código quebrado chegue perto da execução.
2. **Execução Nativa (`npm start`):** Rodo o código JavaScript purificado e otimizado direto no motor do Node.js, garantindo estabilidade total e eliminando qualquer sobrecarga (*overhead*) de ferramentas de desenvolvimento.

---

## 1. Arquitetura em Camadas e Injeção de Dependências

O fluxo do meu sistema respeita uma hierarquia estrita entre as camadas, onde cada componente possui uma responsabilidade única e se comunica estritamente com a camada imediatamente abaixo através de acoplamentos limpos. Realizei a amarração das instâncias manualmente no ponto de entrada do sistema:

```
View (Menus) → Controller → Service (Regras de Negócio) → Repository (Persistência / Banco)

```

| Camada | Responsabilidade | Diretório Correspondente |
| --- | --- | --- |
| **Views / Menus** | Todo o Input e Output (I/O) de console, exibição de opções e laços de tela. | `src/menus/` |
| **Controllers** | Repasse fino dos dados capturados na tela para a camada interna, sem lógica de negócio. | `src/controllers/` |
| **Services** | Core do sistema: onde residem todas as regras de negócio, cálculos e validações estritas. | `src/services/` |
| **Repositories** | Persistência física de dados, responsável pelo isolamento e execução das queries SQL no PostgreSQL. | `src/repositories/` |
| **Models** | Definições das entidades de negócio tipadas e estruturais do sistema. | `src/models/` |

Toda a montagem e amarração do grafo de dependências ocorre no ponto de entrada principal do meu projeto (`src/main.ts`), que atua como a **Raiz de Composição (Composition Root)**. Os objetos são criados e injetados de baixo para cima, garantindo o desacoplamento recomendado pelo princípio de inversão de dependência.

---

## 2. Engenharia de Histórico (Git Flow) e Resiliência com Backup

Um dos grandes focos deste projeto foi o controle rígido do histórico do Git, simulando um cenário corporativo real sujeito a auditorias de código e revisões estritas:

* **Gerenciamento de Erros e Proteção de Histórico:** Diante de commits acidentais realizados diretamente na ramificação principal de integração (`develop`), utilizei manipulações avançadas de histórico (`git reset --hard` combinado com `git push --force-with-lease`) para expurgar rastros redundantes, mantendo a árvore de commits perfeitamente limpa e linear.
* **Estratégia de Branch de Segurança (Backup):** Antes de realizar operações cirúrgicas de reestruturação de histórico e refatorações complexas nas regras de negócio, implementei uma política de mitigação de riscos criando uma branch temporária de salvaguarda (`backup-develop`). Isso garantiu resiliência absoluta e um ponto de acesso seguro para restauração contra perdas de código durante o processo de alinhamento da árvore do repositório.

---

## 3. Política de Erros e Validações de Domínio (RF08, RF10 e RF13)

Seguindo o princípio de que o banco de dados não deve ditar regras de negócio na interface através do estouro bruto de restrições física, implementei uma camada severa de validações na camada de **Services**:

### 1. Garantia de Chaves Estrangeiras de Negócio (RF08)

Ao cadastrar ou atualizar um registro de Livro (`livroService`), meu sistema faz uma checagem ativa no repositório de autores para garantir que o `autorId` fornecido seja real. Caso o autor não exista, interrompo o fluxo imediatamente com uma exceção de domínio, impedindo que o banco de dados PostgreSQL precise rejeitar a transação via restrição de integridade física.

### 2. Validação Tripla de Empréstimos (RF10)

Antes de consolidar um empréstimo na base de dados, a minha função `cadastrarEmprestimo` realiza três validações consecutivas cruciais:

1. Verifica se o livro de fato existe no acervo.
2. Verifica se o cliente informado existe na tabela de clientes.
3. Avalia se há quantidade disponível no estoque para a saída.

### 3. Mensagens Amigáveis ao Usuário (RF13)

Todas as falhas de domínio listadas acima capturam as exceções de negócio e lançam erros amigáveis ao usuário final. Isso impede que mensagens ou logs técnicos do driver do PostgreSQL (como erros crípticos de *Foreign Key Violation*) vazem para a interface, assegurando um comportamento limpo e legível na CLI.

### 4. Revalidação e Proteção contra Duplicidade em Atualizações

Estendi os critérios de segurança de e-mail na camada de clientes (`clienteService`). Tanto no cadastro quanto na atualização, aplico uma checagem dupla: formato válido (exigência de `@`) e unicidade na base. Na edição, a lógica permite que o cliente mantenha o próprio e-mail, mas barra imediatamente o fluxo caso ele tente alterar seus dados para um e-mail que já pertença a outro ID cadastrado no sistema.

---

## 4. Estrutura do Banco de Dados Relacional

O esquema físico do banco de dados relacional foi modelado de forma a garantir a consistência total dos dados, composto pelas tabelas a seguir:

* **`autor`:** Cadastro dos autores de livros.
* **`livro`:** Armazena título, ano de publicação, quantidade geral e a contagem de `quantidade_disponivel`, amarrada por chave estrangeira à tabela `autor`.
* **`cliente`:** Dados dos locatários (nome, e-mail único e telefone).
* **`emprestimo`:** Tabela associativa que gerencia as interações, guardando as chaves estrangeiras de clientes e livros, datas de retirada e status de devolução.

---

## 5. Mapa do Código

```
src/
├── main.ts                         # Raiz de composição e bootstrap da aplicação CLI
├── menus/                          # Camada de View: Interações de terminal e controle do readline
├── controllers/                    # Controladores finos: Fronteira e repasse entre Views e Services
├── services/                       # Camada de Domínio: Regras de negócio essenciais e validações
├── repositories/                   # Camada de Infraestrutura: Conexão e queries SQL (PostgreSQL)
├── models/                         # Definições de Entidades e Tipagens estruturais do sistema
└── database/
    └── connection.ts               # Configuração do Pool de conexões do driver node-postgres (pg)

```