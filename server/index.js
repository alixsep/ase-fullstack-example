import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
const db = new sqlite3.Database('./server/database/database.db');

const app = express();

app.use(cors());

app.get('/:id', (req, res) => {
  db.all(
    `SELECT * FROM Verification WHERE id=?;`,
    req.params.id,
    (err, rows) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(JSON.stringify({ res: rows }));
      // res.status(200).json({ res: rows });
    }
  );
});

app.listen(3000);
