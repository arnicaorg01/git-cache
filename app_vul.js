// vulnerable-app.js
const express = require("express");
const app = express();
const mysql = require("mysql");

app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password", // Hardcoded credentials (SAST issue)
  database: "users_db"
});

db.connect();

// SQL Injection vulnerability
app.get("/user", (req, res) => {
  const username = req.query.username;

  const query = `SELECT * FROM users WHERE username = '${username}'`; // ❌ vulnerable
  db.query(query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Command Injection vulnerability
const { exec } = require("child_process");

app.get("/ping", (req, res) => {
  const host = req.query.host;

  exec(`ping -c 1 ${host}`, (err, stdout) => { // ❌ vulnerable
    if (err) return res.send(err.message);
    res.send(stdout);
  });
});

// XSS vulnerability
app.get("/welcome", (req, res) => {
  const name = req.query.name;
  res.send(`<h1>Welcome ${name}</h1>`); // ❌ no sanitization
});

app.listen(3000, () => console.log("Server running on port 3000"));