require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
  const { name, email, company, vatNumber, password } = req.body;

  if (!name || !vatNumber || !company || !password || !email) {
    return res.status(400).json({ error: 'Alle velden zijn verplicht!' });
  }

  let users = loadUsers();

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Gebruiker bestaat al' });
  }

  const newUser = { name, email, company, vatNumber, password, profilePic: '' };

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
  const { email, name, vatNumber, company, profilePic, password, currentPassword } = req.body;

  if (!email || (!name && !vatNumber && !company && !profilePic && !password)) {
    return res.status(400).json({ error: 'Vereiste gegevens ontbreken' });
  }

  let users = loadUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIndex === -1) {
    return res.status(400).json({ error: 'Gebruiker niet gevonden' });
  }

  const existingUser = users[userIndex];

  
  if (typeof password === 'string' && password.trim().length > 0) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'Huidig wachtwoord is vereist om een nieuw wachtwoord in te stellen.' });
    }

    if (existingUser.password !== currentPassword) {
      return res.status(401).json({ error: 'Huidig wachtwoord is onjuist.' });
    }

    existingUser.password = password;
  }

  if (name) existingUser.name = name;
  if (company) existingUser.company = company;
  if (vatNumber) existingUser.vatNumber = vatNumber;
  if (profilePic) existingUser.profilePic = profilePic;

  users[userIndex] = existingUser;
  saveUsers(users);

  res.json(existingUser);
});


app.post('/send-confirmation-email', async (req, res) => {
  const { email, name, reservations, totalPrice, method, vatNumber } = req.body;

  const htmlList = Object.entries(reservations)
    .map(([dag, tijd]) => `<li>${dag}: ${tijd}</li>`)
    .join('');

  const plainTextList = Object.entries(reservations)
    .map(([dag, tijd]) => `- ${dag}: ${tijd}`)
    .join('\n');

  const msg = {
    to: 'jairoln2612@gmail.com', 
    from: {
      email: 'jairoln@hotmail.com',
      name: 'Reservatie Systeem'
    },
    replyTo: email,
    subject: 'Nieuwe betaling ontvangen',
    text: `Nieuwe reservering ontvangen van ${name} (${email})

Betaalmethode: ${method}
BTW-nummer: ${vatNumber}
Totaalprijs: €${totalPrice}

Geselecteerde dagen:
${plainTextList}
    `,
    html: `
      <h2>Er is een nieuwe reservatie toegekomen.</h2>
      <p><strong>Naam:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Betaalmethode:</strong> ${method}</p>
      <p><strong>BTW-nummer:</strong> ${vatNumber}</p>
      <p><strong>Totaalprijs:</strong> €${totalPrice}</p>
      <h3>Geselecteerde dagen:</h3>
      <ul>${htmlList}</ul>
      <p>Gelieve een factuur te maken voor deze totaalprijs vóór de reservatiedag met een betaaltermijn van 7 dagen.
      De factuur wordt verstuurd via Teamleader naar ${email} </p>
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


app.post('/send-contact-message', async (req, res) => {
  const { name, vatNumber, email, company, message } = req.body;

  const msg = {
    to: 'jairoln2612@gmail.com',
    from: 'jairoln@hotmail.com',
    subject: 'Nieuw contactbericht ontvangen',
    replyTo: email,
    html: `
      <h2>Er is een vraag toegekomen via de reserveringsapp</h2>
      <p><strong>Naam:</strong> ${name}</p>
      <p><strong>BTW-nummer:</strong> ${vatNumber}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Beroep:</strong> ${company}</p>
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
  const { email, reservations, type = type } = req.body;

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
    type: type,
    date,
    time
  }));

  saveReservations([...existingReservations, ...newReservations]);

  res.status(200).json({ message: 'Reservering opgeslagen' });
});

app.get('/reservations', (req, res) => {
  const { email } = req.query;

  const allReservations = loadReservations();

  if (email) {
    const userReservations = allReservations.filter(r => r.email === email);
    return res.json(userReservations);
  }

  res.json(allReservations);
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server draait op poort 3000');
});