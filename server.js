import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = join(__dirname, 'base de datos', 'estudiantes_comunes.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

app.get('/api/student/:id', (req, res) => {
  const studentId = req.params.id;
  
  // Fetch from D1
  db.get("SELECT * FROM D1_encuestas WHERE student_id = ?", [studentId], (err, d1) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!d1) return res.status(404).json({ error: "Student not found" });

    // Fetch from D2
    db.all("SELECT * FROM D2_servicios_apoyo WHERE student_id = ?", [studentId], (err, d2) => {
      if (err) return res.status(500).json({ error: err.message });

      // Fetch from D3
      db.all("SELECT * FROM D3_rendimiento_academico WHERE student_id = ?", [studentId], (err, d3) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          student_id: studentId,
          survey: d1,
          services: d2,
          academic: d3
        });
      });
    });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
