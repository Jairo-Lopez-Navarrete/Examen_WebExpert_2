require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
//const nodemailer = require('nodemailer');


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

  let users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
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
  if (work) updatedUser.work = work;
  if (profilePic) updatedUser.profilePic = profilePic;
  if (password) updatedUser.password = password;

  users[userIndex] = updatedUser;
  saveUsers(users);

  res.json(updatedUser);
});

// Correcte afsluiting toegevoegd hier:
app.post('/send-confirmation-email', async (req, res) => {
  const { email, name, reservations, totalPrice, method } = req.body;

  const htmlList = Object.entries(reservations)
    .map(([dag, tijd]) => `<li>${dag}: ${tijd}</li>`)
    .join('');

  const plainTextList = Object.entries(reservations)
    .map(([dag, tijd]) => `- ${dag}: ${tijd}`)
    .join('\n');

  const msg = {
    to: 'maitemj0112@gmail.com', // Ontvanger
    from: {
      email: 'jairoln@hotmail.com', // <-- Zorg dat dit domein geverifieerd is in SendGrid!
      name: 'Reservatie Systeem'
    },
    replyTo: email,
    subject: 'Nieuwe betaling ontvangen',
    text: `Nieuwe reservering ontvangen van ${name} (${email})

Betaalmethode: ${method}
Totaalprijs: €${totalPrice}

Geselecteerde dagen:
${plainTextList}
    `,
    html: `
      <h2>Nieuwe reservering ontvangen</h2>
      <p><strong>Naam:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Betaalmethode:</strong> ${method}</p>
      <p><strong>Totaalprijs:</strong> €${totalPrice}</p>
      <h3>Geselecteerde dagen:</h3>
      <ul>${htmlList}</ul>
    `
  };

  try {
    await sgMail.send(msg);
    console.log('Bevestigingsmail verzonden');
    res.status(200).json({ message: 'Bevestigingsmail verzonden' });
  } catch (error) {
    console.error('Fout bij verzenden bevestigingsmail:', error.response?.body || error.message || error);
    res.status(500).json({ error: 'Bevestigingsmail mislukt' });
  }
});

// Nu wordt dit endpoint correct aangemaakt:
app.post('/send-contact-message', async (req, res) => {
  const { name, birthdate, email, work, message } = req.body;

  const msg = {
    to: 'maitemj0112@gmail.com',
    from: 'jairoln@hotmail.com', // Moet geverifieerd zijn
    subject: 'Nieuw contactbericht ontvangen',
    replyTo: email,
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
    await sgMail.send(msg);
    console.log('Contactbericht verzonden');
    res.status(200).json({ message: 'Bericht verzonden' });
  } catch (error) {
    console.error('Fout bij verzenden contactbericht:', error.response?.body || error);
    res.status(500).json({ error: 'Verzenden mislukt' });
  }
});

// RESERVATIONS
const reservationsFilePath = path.join(__dirname, 'reservations.json');

const loadReservations = () => {
  if (fs.existsSync(reservationsFilePath)) {
    const data = fs.readFileSync(reservationsFilePath);
    return JSON.parse(data);
  }
  return [];
};

const saveReservations = (reservations) => {
  fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));
};

app.post('/reserve', (req, res) => {
  const { email, reservations } = req.body;

  if (!reservations || !email) {
    return res.status(400).json({ error: 'Email en reserveringen zijn verplicht' });
  }

  let existingReservations = loadReservations();

  const conflicts = Object.entries(reservations).filter(([date, time]) =>
    existingReservations.some(r => r.date === date && r.time === time)
  );

  if (conflicts.length > 0) {
    return res.status(409).json({ error: 'Een of meer dagdelen zijn al gereserveerd', conflicts });
  }

  const newReservations = Object.entries(reservations).map(([date, time]) => ({
    email,
    date,
    time
  }));

  saveReservations([...existingReservations, ...newReservations]);

  res.status(200).json({ message: 'Reservering opgeslagen' });
});

app.get('/reservations', (req, res) => {
  const reservations = loadReservations();
  res.json(reservations);
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server draait op poort 3000');
});