const connect = async () => {
	const { Pool } = require("pg");

	if (global.connection) return global.connection.connect();

	const pool = new Pool({
		user: process.env.USER_NAME,
		host: process.env.HOST_NAME,
		database: process.env.DB_NAME,
		password: process.env.DB_PASSWORD,
		dialect: process.env.DB_DIALECT,
		port: process.env.PORT_NUMBER,
	});

	const client = await pool.connect();
	console.log("O Pool de conexão foi criado com sucesso!");
	client.release();

	global.connection = pool;

	return pool.connect();
};

connect();

const selectCustomers = async () => {
	const client = await connect();
	const res = await client.query("SELECT * FROM client");
	return res.rows;
};

const selectCustomer = async (id) => {
	const client = await connect();
	const res = await client.query("SELECT * FROM client WHERE cpf=$1", [id]);
	return res.rows;
};

const insertCustomers = async (customers) => {
	const client = await connect();
	const sql = "INSERT INTO client (cpf, nome, email, idade, profissao) VALUES ($1, $2, $3, $4, $5);";
	const values = [customers.cpf, customers.nome, customers.email, customers.idade, customers.profissao];
	await client.query(sql, values);
};

const deleteCustomer = async (id) => {
	const client = await connect();
	await client.query("DELETE FROM client WHERE cpf=$1", [id]);
};

const updateCustomer = async (id, customer) => {
	const client = await connect();
	const sql = "UPDATE client SET nome=$1, email=$2, idade=$3, profissao=$4 WHERE cpf=$5";
	const values = [customer.nome, customer.email, customer.idade, customer.profissao, id];
	await client.query(sql, values);
};

module.exports = {
	insertCustomers,
	selectCustomers,
	selectCustomer,
	deleteCustomer,
	updateCustomer,
};
