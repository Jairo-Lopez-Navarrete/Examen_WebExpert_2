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

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Gebruiker bestaat al' });
  }

  const newUser = { name, birthdate, email, work, password, profilePic: '' };

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



app.put('/EditProfile', (req, res) => {
  const { email, name, birthdate, work, profilePic, password } = req.body;

  if (!email || (!name && !birthdate && !work && !profilePic && !password)) {
    return res.status(400).json({ error: 'Vereiste gegevens ontbreken' });
  }

  let users = loadUsers();
  
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIndex === -1) {
    return res.status(400).json({ error: 'Gebruiker niet gevonden' });
  }

  const updatedUser = users[userIndex];
  
  if (name) updatedUser.name = name;
  if (birthdate) updatedUser.birthdate = birthdate;
  if (email) updatedUser.email = email;
  if (work) updatedUser.work = work;
  if (profilePic) updatedUser.profilePic = profilePic;
  if (password) updatedUser.password = password;

  users[userIndex] = updatedUser;
  saveUsers(users);

  console.log('Gebruiker bijgewerkt:', updatedUser);

  res.json(updatedUser);
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server draait op poort 3000');
});