
# HyperVault

HyperVault é uma biblioteca de componentes UI moderna e modular desenvolvida em Angular, projetada para acelerar o desenvolvimento de aplicações web com uma experiência visual consistente e acessível. O projeto oferece uma coleção abrangente de componentes reutilizáveis, como botões, formulários, tabelas, navegação, alertas, entre outros, todos seguindo as melhores práticas do Angular.

Este repositório inclui:
- **Biblioteca de componentes**: localizada em `projects/hypervault`.
- **Aplicação de demonstração**: localizada em `src/`, para visualizar e testar os componentes.

> Gerado com [Angular CLI](https://github.com/angular/angular-cli) versão 21.2.3.


## Como rodar localmente

1. **Clone o repositório:**
	```bash
	git clone https://github.com/seu-usuario/hypervault.git
	cd hypervault
	```
2. **Instale as dependências:**
	```bash
	npm install
	```
3. **Inicie o servidor de desenvolvimento:**
	```bash
	npm start
	```
	Acesse `http://localhost:4200/` no navegador. O app recarrega automaticamente ao salvar alterações.


## Gerando código com Angular CLI

Para criar novos componentes, serviços ou outros artefatos, utilize:
```bash
ng generate component nome-do-componente
```
Veja todos os esquemas disponíveis com:
```bash
ng generate --help
```


## Build do projeto

Para compilar a biblioteca e a aplicação de demonstração:
```bash
npm run build
```
Os artefatos serão gerados na pasta `dist/`.


## Testes unitários

Para rodar os testes unitários com o [Vitest](https://vitest.dev/):
```bash
npm test
```


## Testes end-to-end

Para testes e2e, configure o framework de sua preferência e utilize:
```bash
ng e2e
```


## Recursos adicionais

Para mais informações sobre o Angular CLI, consulte a [documentação oficial](https://angular.dev/tools/cli).

---

Sinta-se à vontade para contribuir, abrir issues ou sugerir melhorias!
