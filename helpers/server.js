const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let users = [];

app.post('/login', (req, res) => {
  const { name, birthdate, work } = req.body;
  const user = { name, birthdate, work, profilePic: '' };
  users.push(user);
  res.json(user);
});

app.get('/user', (req, res) => {
  if (users.length === 0) return res.status(404).json({ error: 'Geen gebruiker gevonden' });
  res.json(users[0]);
});


//dummy account
/*app.get('/user', (req, res) => {
    if (users.length === 0) {
      users.push({ name: "Test Gebruiker", birthdate: "2000-01-01", work: "Developer", profilePic: "" });
    }
    res.json(users[0]);
  });*/


app.post('/logout', (req, res) => {
  users = [];
  res.json({ message: 'Uitgelogd' });
});

app.listen(3000, '0.0.0.0', () => console.log('Server draait op poort 3000'));