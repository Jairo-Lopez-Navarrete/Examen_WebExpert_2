// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const app = express();

// app.use(cors());
// app.use(express.json());

// // Bestand om gebruikers op te slaan
// const usersFilePath = path.join(__dirname, 'users.json');

// // Hulpfunctie om gebruikersgegevens te laden uit het bestand
// const loadUsers = () => {
//   if (fs.existsSync(usersFilePath)) {
//     const data = fs.readFileSync(usersFilePath);
//     return JSON.parse(data);
//   }
//   return [];
// };

// // Hulpfunctie om de gebruikersgegevens naar het bestand te schrijven
// const saveUsers = (users) => {
//   fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
// };

// // Inloggen
// app.post('/login', (req, res) => {
//   const { name, birthdate, work, password } = req.body;

//   let users = loadUsers();
//   const existingUser = users.find(user => user.name === name && user.birthdate === birthdate);

//   // Als de gebruiker bestaat en de gegevens overeenkomen
//   if (existingUser) {
//     if (existingUser.password === password) {
//       res.json(existingUser); // Gebruiker inloggen en gegevens sturen
//     } else {
//       res.status(401).json({ error: 'Wachtwoord klopt niet' });
//     }
//   } else {
//     // Als de gebruiker niet bestaat, maak een nieuw account aan
//     const newUser = { name, birthdate, work, password, profilePic: '' };
//     users.push(newUser);
//     saveUsers(users); // Sla de gebruiker op in het bestand
//     res.json(newUser); // Nieuwe gebruiker wordt aangemaakt en geretourneerd
//   }
// });

// // Verkrijg een gebruiker (alleen ingelogde gebruiker kan zijn gegevens ophalen)
// app.get('/user', (req, res) => {
//   let users = loadUsers();
//   const { name } = req.query; // Je kunt de naam van de gebruiker krijgen via query parameters of headers

//   const user = users.find(u => u.name === name);
//   if (user) {
//     res.json(user);
//   } else {
//     res.status(404).json({ error: 'Gebruiker niet gevonden' });
//   }
// });

// // Uitloggen (verwijder de gebruikerssessie, als je sessiebeheer implementeert)
// app.post('/logout', (req, res) => {
//   // Je kunt hier sessie- of JWT-gebaseerd logoutbeleid implementeren
//   res.json({ message: 'Uitgelogd' });
// });

// app.listen(3000, '0.0.0.0', () => {
//   console.log('Server draait op poort 3000');
// });