GITHUB ALLSTARS - ESCALE
===================

Instruções
-------------

> **Observações:**

> - É necessário instalar qualquer versão estável do [NodeJS](https://nodejs.org/en/ "NodeJS")
> - Os comandos de terminal devem ser excutados dentro do diretório da aplicação: `github-all-stars`.>

#### Instalando dependências do projeto

Navegue até a pasta do repositório `github-all-stars` no **terminal** e execute o comando `npm install` para instalar as dependências do **node.js** e criar a pasta **node_modules**.

#### Rodando a aplicação
Uma das dependências é o *task manager*  **Gulp**, responsável pelo gerenciamento das tarefas da camada do front-end  e também por subir a aplicação na porta 9000.
Após a instalação do node, instale o `o cli do gulp` executando o comando `npm install gulp-cli` para poder executar o comando gulp no terminal.

Rode o comando `gulp`  para dar início e rodar a aplicação.
O pojeto compilado irá compor a pasta `build` na raíz da pasta do projeto.

Caso haja dificuldades em executar o projeto por linha de comando, o mesmo encontra-se disponível (já compilado) na pasta `github-all-stars/build/`

> **Dependências utilizadas no projeto:**

> - `gulp-watch` - Monitora alterações em todos os arquivos do projeto
> - `browser-sync` - Sincroniza o browser às alterações realizadas em todos os arquivos "assistidos" pelo gulp.
> - `gulp-rigger` - Permite modularização de componentes html, para criação de partials.
> - `gulp-sass` - Suporte ao pré processador SASS em CSS.
> - `gulp-rimraf` - Suporte a exclusão de pastas (necessário para limpar a pasta build e criar uma nova, a cada comando `gulp`.
>
