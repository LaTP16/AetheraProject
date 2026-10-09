const fs = require('fs');
const lines = fs.readFileSync('C:/Users/USER/Desktop/AetheraProject/Datasets/D6.csv', 'utf8').trim().split('\n');
const services = lines.slice(1).map(line => {
  const parts = [];
  let inQuotes = false;
  let current = '';
  for(let char of line) {
    if(char === '"') inQuotes = !inQuotes;
    else if(char === ',' && !inQuotes) { parts.push(current); current = ''; }
    else current += char;
  }
  parts.push(current);
  return parts;
});

const recommendations = services.map(s => {
  let category = 'SERVICIOS';
  let categoryLabel = 'Servicios Universitarios';
  if(s[2] === 'peer_support') { category = 'APOYO'; categoryLabel = 'Apoyo de Pares'; }
  if(s[2] === 'career_guidance') { category = 'RECURSOS'; categoryLabel = 'Orientación de Carrera'; }
  
  return {
    service_id: s[0],
    category: category,
    categoryLabel: categoryLabel,
    title: s[1],
    description: 'Servicio de ' + s[2] + ' enfocado en tu bienestar y desarrollo personal.',
    schedule: s[4],
    location: s[3] + ' - Canales: ' + s[6],
    capacity: s[5] + ' atenciones semanales',
    eligibility: s[7],
    referralReqs: s[8]
  };
});

fs.writeFileSync('C:/Users/USER/Desktop/AetheraProject/Datasets/frontend_recs.json', JSON.stringify(recommendations, null, 2));
console.log('Saved frontend_recs.json');
