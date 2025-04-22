
# API Magic Stores

## Descrição

Esta API permite consultar informações sobre lojas, incluindo a listagem de todas as lojas, busca por CEP, por ID, por estado, e cálculo de frete. A API também fornece coordenadas geográficas para as lojas, que podem ser usadas para gerar pins em mapas.

## Funcionalidades

- **Listar todas as lojas**
- **Buscar lojas próximas a um CEP e calcula frete**
- **Buscar loja por ID**
- **Buscar lojas por estado**

## Tecnologias

- **NestJS**: Framework para Node.js baseado em TypeScript
- **Swagger**: Documentação interativa para os endpoints da API

## Instalação

### 1. Clonando o Repositório

Clone o repositório em sua máquina local:

```bash
git clone <URL_DO_REPOSITORIO>
cd <DIRETORIO_DO_REPOSITORIO>
```

### 2. Instalando Dependências

Instale as dependências do projeto:

```bash
npm install
```

### 3. Rodando a API

Para rodar a API em ambiente de desenvolvimento:

```bash
npm run start
```

A API estará disponível em `http://localhost:3000`.

## Endpoints

### 1. **Listar todas as lojas**

- **Rota**: `GET /api/stores`
- **Descrição**: Retorna uma lista de todas as lojas cadastradas.
- **Respostas**:
  - **200**: Lista de lojas retornada com sucesso.
  ```json
  {
    "stores": [...],
    "total": 10
  }
  ```
  - **400**: Erro ao buscar lojas.
  ```json
  {
    "statusCode": 400,
    "message": "Erro ao buscar lojas"
  }
  ```

### 2. **Buscar lojas próximas por CEP e calcula frete**

- **Rota**: `GET /api/stores/:cep`
- **Parâmetros**:
  - `cep` (obrigatório): O CEP para calcular as lojas próximas.
- **Descrição**: Retorna as lojas próximas ao CEP informado, com cálculo de frete e localização no mapa (pins).
- **Respostas**:
  - **200**: Retorna lojas próximas com cálculo de frete e pins.
  ```json
  {
    "stores": [...],
    "pins": [...],
  }
  ```
  - **404**: Nenhuma loja encontrada para o CEP informado.
  ```json
  {
    "statusCode": 404,
    "message": "Não foi encontrada nenhuma loja próxima a você"
  }
  ```
  - **400**: Erro ao buscar lojas próximas.
  ```json
  {
    "statusCode": 400,
    "message": "Erro ao buscar lojas próximas"
  }
  ```

### 3. **Buscar loja por ID**

- **Rota**: `GET /api/stores/by-id/:id`
- **Parâmetros**:
  - `id` (obrigatório): O ID da loja a ser buscada.
- **Descrição**: Retorna uma loja com base no ID fornecido.
- **Respostas**:
  - **200**: Retorna a loja com base no ID.
  ```json
  {
    "store": {...},
    "pins": [...],
    "limit": 1,
    "offset": 0
  }
  ```
  - **404**: Loja não encontrada.
  ```json
  {
    "statusCode": 404,
    "message": "Loja não encontrada"
  }
  ```
  - **400**: Erro ao buscar loja por ID.
  ```json
  {
    "statusCode": 400,
    "message": "Erro ao buscar loja por ID"
  }
  ```

### 4. **Buscar lojas por estado**

- **Rota**: `GET /api/stores/by-state/:state`
- **Parâmetros**:
  - `state` (obrigatório): O estado para filtrar as lojas.
- **Descrição**: Retorna uma lista de lojas filtradas pelo estado informado.
- **Respostas**:
  - **200**: Lista de lojas no estado informado.
  ```json
  {
    "store": [...],
    "limit": 10,
    "offset": 0,
    "total": 10
  }
  ```
  - **404**: Nenhuma loja encontrada para o estado fornecido.
  ```json
  {
    "statusCode": 404,
    "message": "Nenhuma loja encontrada para esse estado"
  }
  ```
  - **400**: Erro ao buscar lojas por estado.
  ```json
  {
    "statusCode": 400,
    "message": "Erro ao buscar lojas por estado"
  }
  ```

### 👨‍💻 Autor

Feito com ❤️ por Vih

---


