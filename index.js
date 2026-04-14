const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const ADMINS = [
  "jabojulesmaurice@gmail.com", "gasnamoses01@gmail.com",
  "uwingabireange2003@gmail.com", "uwajenezaernestine2002@gmail.com",
  "kayitareprecious057@gmail.com"
];

// 1. Home Page (Public)
app.get('/', (req, res) => {
  res.send('<h1>JAMUP Eletrônica HUB</h1><p>Admin Login Required.</p>');
});

// 2. Admin Dashboard (Analytics)
app.get('/dashboard', async (req, res) => {
  const email = req.query.email;
  if (ADMINS.includes(email)) {
    try {
      const stats = await pool.query('SELECT COUNT(*) as total, SUM(cost) as revenue FROM repairs');
      res.send(`
        <body style="font-family:sans-serif; padding:40px; background:#f0f2f5;">
          <h1 style="color:#1a73e8;">📊 Business Analytics</h1>
          <div style="display:flex; gap:20px; margin-bottom:30px;">
            <div style="background:white; padding:20px; border-radius:10px; flex:1; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
              <h3>Total Repairs</h3>
              <p style="font-size:32px; margin:0;">${stats.rows[0].total}</p>
            </div>
            <div style="background:white; padding:20px; border-radius:10px; flex:1; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
              <h3>Revenue</h3>
              <p style="font-size:32px; color:green; margin:0;">$${stats.rows[0].revenue || 0}</p>
            </div>
          </div>
          <h2>Add New Record</h2>
          <form action="/add" method="POST">
            <input name="device" placeholder="Device Name" required>
            <input name="cost" type="number" placeholder="Cost" required>
            <input type="hidden" name="email" value="${email}">
            <button type="submit">Save to Render DB</button>
          </form>
        </body>
      `);
    } catch (err) { res.status(500).send("Database Error"); }
  } else { res.status(403).send("Access Denied"); }
});

// 3. Add Data Route
app.post('/add', async (req, res) => {
  const { device, cost, email } = req.body;
  await pool.query('INSERT INTO repairs (device, cost) VALUES ($1, $2)', [device, cost]);
  res.redirect(`/dashboard?email=${email}`);

});

app.listen(3000, () => console.log('🚀 Final JAMUP Hub Code Ready!'));
