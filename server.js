const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

// create a connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "secret",
  database: "vue_node",
});

// create the express application

const app = express();

app.use(bodyParser.json());

// get all todos
app.get("/api/todo", (_, res) => {
  const query = "SELECt * from todo";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Failed to fetch todo: ", error);
      res.status(500).json({ error: "Failed to fetch todo" });
    } else {
      res.status(200).json(results);
    }
  });
});

// get single todo
app.get("/api/todo/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM todo WHERE id = ?";

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Failed to fetch todo: ", error);
      res.status(500).json({ error: "Failed to fetch todo" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.json(results[0]);
    }
  });
});

// create a new todo
app.post("/api/todo", (req, res) => {
  const { name, value } = req.body;
  const query = "INSERT INTO todo (name) VALUES(?)";

  connection.query(query, [name, value], (error, result) => {
    if (error) {
      console.error("Failed to create todo: ", error);
    } else {
      res.status(201).json({ id: result.insertId, name });
    }
  });
});

app.put("/api/todo/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const query = "UPDATE todo SET name = ? WHERE id = ?";

  connection.query(query, [name, id], (error, result) => {
    if (error) {
      console.error("Failed to update data: ", error);
      res.status(500).json({ error: "Failed to update todo" });
    } else if (result.affectedRow === 0) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.json({ id, name });
    }
  });
});

app.delete("/api/todo/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM todo WHERE id = ?";

  connection.query(query, [id], (error, result) => {
    if (error) {
      console.error("Failed to delete todo: ", error);
      res.status(500).json({ error: "Failed to delete data" });
    } else if (result.affectedRow === 0) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.status(200).json({ message: "Todo delete successfully" });
    }
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
