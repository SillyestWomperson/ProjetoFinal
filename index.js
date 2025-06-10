require("dotenv").config();

const db = require("./db");
const port = process.env.PORT;
const app = require("express");

app.use(express.json());

app.get("/client", async (req, res) => {
	const clientes = await db.selectCustomers();
	res.json(clientes);
});

app.get("/client/:id", async (req, res) => {
	const cliente = await db.selectCustomer(req.params.id);
	res.json(cliente);
});

app.post("/client", async (req, res) => {
	await db.insertCustomers(req.body);
	res.sendStatus(201);
});

app.patch("/client/:id", async (req, res) => {
	await db.updateCustomer(req.params.id, req.body);
	res.sendStatus(200);
});

app.delete("/client/:id", async (req, res) => {
	await db.deleteCustomer(req.params.id);
	res.sendStatus(200);
});

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
