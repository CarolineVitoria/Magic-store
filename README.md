🧙🏻‍♀️ Magic Steps

API para cadastrar lojas, listar todas as cadastradas e buscar lojas próximas a um CEP.

🚀 Como rodar o projeto

1️⃣- Instale as dependências

npm install

2️⃣- Configure as variáveis de ambiente

Crie um arquivo .env e adicione:

PORT=3000

DB_CONNECTION_STRING=mongodb://localhost:27017/lojas

GOOGLE_MAPS_API_KEY=xxxxxx

3️⃣- Inicie o servidor

npm run dev

⸻

📍 Base URL: http://localhost:3000/api

⸻

🛠 Endpoints

1️⃣ Cadastrar uma nova loja
	•	Método: POST
	•	Rota: /stores/add
	•	Descrição: Registra uma loja no sistema.

📩 Exemplo de Requisição (JSON)

{
  "nome": "Loja Exemplo",
  "cep": "01001-000"
}

📤 Resposta

✅ 201 Created - Loja cadastrada com sucesso

{
  "novaLoja": {
    "id": "123456",
    "nome": "Loja Exemplo",
    "cep": "01001-000",
    "rua": "Rua Exemplo",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "complemento": "Loja 2"
  }
}

❌ 400 Bad Request - Erro nos dados fornecidos

{
  "O nome é obrigatório"
}

⸻

2️⃣ Listar todas as lojas cadastradas
	•	Método: GET
	•	Rota: /stores
	•	Descrição: Retorna uma lista de todas as lojas cadastradas.

📤 Respostas

✅ 200 OK

[
  {
    "id": "123456",
    "nome": "Loja Exemplo",
    "cep": "01001-000",
    "rua": "Rua Exemplo",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "complemento": "Loja 2"
  },
  {
    "id": "654321",
    "nome": "Outra Loja",
    "cep": "02002-000",
    "rua": "Avenida Teste",
    "bairro": "Vila Teste",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "complemento": ""
  }
]



⸻

3️⃣ Buscar lojas próximas a um CEP
	•	Método: GET
	•	Rota: /stores/{cep}
	•	Descrição: Retorna as lojas que estão em um raio de até 100 km do CEP informado.

📤 Respostas

✅ 200 OK - Lojas encontradas próximas ao CEP informado

[
  {
    "id": "123456",
    "nome": "Loja Exemplo",
    "distancia": 5.2 KM,
    "duracao": "0 H, 0 Min",
    "cep": "01001-000",
    "rua": "Rua Exemplo",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP"
  }
]

❌ 400 Bad Request - CEP inválido

{
  "error": "CEP inválido ou formato incorreto"
}

❌ 404 Not Found - Nenhuma loja encontrada

{
  "message": "Nenhuma loja encontrada em um raio de 100km"
}



⸻

⚙ Tecnologias Utilizadas
	•	Node.js
	•	Express
	•	TypeScript
	•	MongoDB

⸻

🚀 Criado por: vih

⸻
