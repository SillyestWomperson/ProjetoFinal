async function connect() {  
    const { Pool } = require("pg");

    if(global.connection)
        return global.connection.connect();

    const pool = new Pool({
      user: process.env.USER_NAME,
      host: process.env.HOST_NAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      dialect: process.env.DB_DIALECT,
      port: process.env.PORT_NUMBER
    });
    
    const client = await pool.connect();
    console.log("O Pool de conexão foi criado com sucesso!")
    client.release();

    global.connection = pool;
    
    return pool.connect();
  }

  connect();


// Função para listar clientes
async function selectCustomers() {
  // Estabelecer conexão com o banco de dados
  const client = await connect();
  // Enviar comando SQL para o banco de dados
  const res = await client.query("SELECT * FROM client");
  // Retorna as linhas (registros) da tabela
  return res.rows;
  }

  // Função para listar um cliente
async function selectCustomer(id) {
  // Estabelece a conexão com o banco de dados
  const client = await connect();
  // Executa a query SQL usando declaração preparada para evitar SQL Injection
  const res = await client.query("SELECT * FROM client WHERE cpf=$1", [id]);
  // Retorna as linhas (dados do cliente)
  return res.rows;
  }

  // Função para inserir clientes
async function insertCustomers(customers) {

  // Estabelecer conexão
  const client = await connect();

  // query
  const sql = "INSERT INTO client(cpf, nome, email, idade, profissao) VALUES($1, $2, $3, $4, $5); "

  //parametros injetados na consulta
  const values = [customers.cpf, customers.nome, customers.email, customers.idade, customers.profissao];

  await client.query(sql, values);

}

  module.exports = {
    insertCustomers,
    selectCustomers,
    selectCustomer
  }