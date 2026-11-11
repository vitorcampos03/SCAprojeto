require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.static("SCA")); // coloque seus .html, .css e .js dentro de /public

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Listar todos
app.get("/api/inventario", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM inventario ORDER BY id");
    res.json(rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao listar itens" });
  }
});

// Buscar um (para a tela de editar)
app.get("/api/inventario/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM inventario WHERE id = $1", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ erro: "Item não encontrado" });
    res.json(rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar item" });
  }
});

// Criar
app.post("/api/inventario", async (req, res) => {
  const { codigo, modelo, unidade, status } = req.body;
  if (!codigo || !modelo || !unidade) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando" });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO inventario (codigo, modelo, unidade, status)
       VALUES ($1, $2, $3, COALESCE($4, 'Disponível')) RETURNING *`,
      [codigo, modelo, unidade, status]
    );
    res.status(201).json(rows[0]);
  } catch (erro) {
    if (erro.code === "23505") return res.status(409).json({ erro: "Código já cadastrado" });
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar item" });
  }
});

// Atualizar
app.put("/api/inventario/:id", async (req, res) => {
  const { codigo, modelo, unidade, status } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE inventario SET codigo=$1, modelo=$2, unidade=$3, status=$4
       WHERE id=$5 RETURNING *`,
      [codigo, modelo, unidade, status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: "Item não encontrado" });
    res.json(rows[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao atualizar item" });
  }
});

// Remover
app.delete("/api/inventario/:id", async (req, res) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM inventario WHERE id = $1", [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ erro: "Item não encontrado" });
    res.status(204).end();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao remover item" });
  }
});

app.listen(3000, () => console.log("SCA rodando em http://localhost:3000"));