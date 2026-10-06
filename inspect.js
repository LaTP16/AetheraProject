import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('base de datos/estudiantes_comunes.db');

db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, tables) => {
  if (err) throw err;
  console.log("Tables:", tables.map(t => t.name));
  
  tables.forEach(table => {
    db.all(`PRAGMA table_info(${table.name})`, (err, cols) => {
      console.log(`\nTable ${table.name} columns:`);
      console.log(cols.map(c => c.name).join(', '));
    });
  });
});
