const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer'); // ✅ toegevoegd

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

  let users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

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


// ✅ NIEUW: Endpoint om bevestigingsemail te versturen
app.post('/send-confirmation-email', async (req, res) => {
  const { email, name, reservations, totalPrice, method } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'jouwhotmail@hotmail.com',         // <-- vervang door jouw Gmail
      pass: 'jouw_app_wachtwoord'          // <-- app-wachtwoord, geen gewoon wachtwoord!
    }
  });

  const mailOptions = {
    from: 'jouwhotmail@hotmail.com',
    to: 'jairoln@hotmail.com',
    subject: 'Nieuwe betaling ontvangen',
    html: `
      <h2>Nieuwe reservering ontvangen</h2>
      <p><strong>Naam:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Betaalmethode:</strong> ${method}</p>
      <p><strong>Totaalprijs:</strong> €${totalPrice}</p>
      <h3>Geselecteerde dagen:</h3>
      <ul>
        ${Object.entries(reservations).map(([dag, tijd]) => `<li>${dag}: ${tijd}</li>`).join('')}
      </ul>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Bevestigingsmail verzonden' });
  } catch (error) {
    console.error('Fout bij verzenden e-mail:', error);
    res.status(500).send({ error: 'E-mail verzenden mislukt' });
  }
});


app.post('/send-contact-message', async (req, res) => {
  const { name, birthdate, email, work, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'jairoln@hotmail.com',
      pass: 'lopez2010'
    }
  });

  const mailOptions = {
    from: email,
    to: 'jairoln@hotmail.com',
    subject: 'Nieuw contactbericht ontvangen',
    html: `
      <h2>Contactformulier</h2>
      <p><strong>Naam:</strong> ${name}</p>
      <p><strong>Geboortedatum:</strong> ${birthdate}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Beroep:</strong> ${work}</p>
      <h3>Bericht:</h3>
      <p>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Bericht verzonden' });
  } catch (error) {
    console.error('Fout bij verzenden contactbericht:', error);
    res.status(500).json({ error: 'Verzenden mislukt' });
  }
});


app.listen(3000, '0.0.0.0', () => {
  console.log('Server draait op poort 3000');
});