const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, 'users.json');

const loadUsers = () => {
  if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
  }
  return [];
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

app.post('/register', (req, res) => {
  const { name, birthdate, email, work, password } = req.body;

  if (!name || !birthdate || !work || !password || !email) {
    return res.status(400).json({ error: 'Alle velden zijn verplicht!' });
  }

  let users = loadUsers();

  // Controleer of de gebruiker al bestaat
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Gebruiker bestaat al' });
  }

  // Maak een nieuw gebruikersobject
  const newUser = { name, birthdate, email, work, password, profilePic: '' };

  // Voeg gebruiker toe aan de lijst en sla op in users.json
  users.push(newUser);
  saveUsers(users);

  console.log('Nieuwe gebruiker geregistreerd:', newUser);

  res.json(newUser);
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Aangekomen verzoek:', req.body);

  console.log('Login poging:', {email, password});
  
  
  let users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  console.log('Gebruiker gevonden', user);

  if (!user) {
    console.log('Inloggen mislukt: Gebruiker niet gevonden');
    return res.status(400).json({ error: 'E-mailadres of wachtwoord onjuist' });
  }

  res.json(user);
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server draait op poort 3000');
});