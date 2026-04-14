/**
 * @file index.js
 * @description Master Control Engine for JAMUP Global HUB.
 * Features: Responsive Mobile UI, Elite Five Security, and Master Reporting.
 * @author JAMUP Technical Development Team
 */

const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const SYSTEM_PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- 🗄️ DATABASE INFRASTRUCTURE ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
// --- AUTO-FIX GATEWAY ---
async function ensureDatabaseStructure() {
  try {
    await pool.query('ALTER TABLE repairs ADD COLUMN IF NOT EXISTS customer_name TEXT');
    await pool.query('ALTER TABLE repairs ADD COLUMN IF NOT EXISTS customer_location TEXT');
    await pool.query('ALTER TABLE repairs ADD COLUMN IF NOT EXISTS problem_details TEXT');
    console.log("✅ Render database structure verified and fixed.");
  } catch (err) {
    console.log("Database already up to date.");
  }
}
ensureDatabaseStructure();


// --- 🔐 SECURITY PROTOCOL ---
const AUTHORIZED_ADMINS = [
  "jabojulesmaurice@gmail.com", "gasnamoses01@gmail.com",
  "uwingabireange2003@gmail.com", "uwajenezaernestine2002@gmail.com",
  "kayitareprecious057@gmail.com"
];
const MASTER_KEY = "jamupglobal@2026";

// --- 🎨 RESPONSIVE UI SHELL ---
const UI_SHELL = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; font-family:'Segoe UI', sans-serif; background:#0f172a; color:white; display:flex; flex-direction:column; min-height:100vh; }
    nav { display:flex; justify-content:space-between; align-items:center; padding:15px 5%; background:#1e293b; border-bottom:1px solid #334155; position:sticky; top:0; z-index:1000; }
    nav a { color:white; text-decoration:none; font-weight:bold; font-size:14px; margin-left:15px; }
    .container { max-width:1100px; margin:auto; padding:20px; flex:1; width:100%; box-sizing:border-box; }
    .card { background:#1e293b; padding:30px; border-radius:15px; border:1px solid #334155; margin-bottom:20px; }
    .btn { background:#38bdf8; color:#0f172a; border:none; padding:12px 25px; border-radius:8px; font-weight:bold; cursor:pointer; text-decoration:none; display:inline-block; }
    input, textarea { width:100%; padding:12px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:8px; box-sizing:border-box; }
    footer { background:#1e293b; padding:25px; text-align:center; border-top:1px solid #334155; color:#94a3b8; font-size:13px; }
    @media (max-width: 768px) { .mobile-hide { display:none; } h1 { font-size:32px !important; } }
  </style>
</head>
<body>
  <nav>
    <h2 style="color:#38bdf8; margin:0;">JAMUP <span style="font-weight:lighter; color:white;">HUB</span></h2>
    <div>
      <a href="/" class="mobile-hide">HOME</a>
      <a href="/admin-login" style="background:#38bdf8; color:#0f172a; padding:8px 18px; border-radius:5px;">ADMIN</a>
    </div>
  </nav>
  <div class="container">${content}</div>
  <footer>&copy; ${new Date().getFullYear()} JAMUP Global Hub. All rights reserved.</footer>
</body>
</html>
`;

// --- 🏠 PUBLIC PAGES ---
app.get('/', (req, res) => {
  res.send(UI_SHELL(`
    <div style="text-align:center; padding:40px 0;">
      <h1 style="font-size:54px; margin-bottom:15px;">Elite Tech <span style="color:#38bdf8;">Solutions</span>.</h1>
      <img src="https://unsplash.com" style="width:100%; max-width:500px; border-radius:20px; margin:30px 0; border:4px solid #1e293b;" alt="Team">
      <div class="card" style="max-width:420px; margin:auto; text-align:left;">
        <h2 style="color:#38bdf8; margin-top:0;">Request a Repair</h2>
        <form action="/submit-request" method="POST">
          <input name="name" placeholder="Full Name" required>
          <input name="location" placeholder="Location (e.g. Muhoza)" required>
          <textarea name="problem" placeholder="Describe the problem..." required style="height:100px;"></textarea>
          <button type="submit" class="btn" style="width:100%;">SUBMIT TO HUB</button>
        </form>
      </div>
    </div>
  `));
});

// --- 🚀 BACKEND PROCESSING ---
app.post('/submit-request', async (req, res) => {
  const { name, location, problem } = req.body;
  try {
    await pool.query(
      'INSERT INTO repairs (customer_name, customer_location, problem_details) VALUES ($1, $2, $3)',
      [name, location, problem]
    );
    res.send(UI_SHELL(`<h1 style="color:#38bdf8;">Success!</h1><p>The JAMUP team will contact you soon.</p><a href="/" class="btn">Back Home</a>`));
  } catch (err) {
    res.status(500).send(UI_SHELL(`<h1>Database Fault</h1><p>${err.message}</p>`));
  }
});

// --- 🔐 ADMIN GATEWAY ---
app.get('/admin-login', (req, res) => {
  res.send(UI_SHELL(`
    <div style="max-width:350px; margin:100px auto;">
      <div class="card">
        <h2 style="color:#38bdf8; margin:0;">Admin Access</h2>
        <form action="/dashboard" method="POST">
          <input type="email" name="email" placeholder="Admin Email" required>
          <input type="password" name="password" placeholder="Master Password" required>
          <button type="submit" class="btn" style="width:100%;">LOGIN</button>
        </form>
      </div>
    </div>
  `));
});

app.post('/dashboard', async (req, res) => {
  const { email, password } = req.body;
  if (!AUTHORIZED_ADMINS.includes(email) || password !== MASTER_KEY) {
    return res.status(403).send(UI_SHELL(`<h1>Access Denied</h1><a href="/admin-login" class="btn">Back</a>`));
  }
  const clients = await pool.query('SELECT COUNT(*) as count FROM repairs');
  const revenue = await pool.query('SELECT SUM(cost) as total FROM repairs');
  const logs = await pool.query('SELECT * FROM repairs ORDER BY created_at DESC');
  res.send(UI_SHELL(`
    <h1>Master <span style="color:#38bdf8;">Analytics</span></h1>
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-bottom:30px;">
      <div class="card"><h3>Clients</h3><p style="font-size:32px;">${clients.rows[0].count}</p></div>
      <div class="card"><h3>Revenue</h3><p style="font-size:32px; color:#22c55e;">$${revenue.rows[0].total || 0}</p></div>
    </div>
    <div class="card" style="padding:0; overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; text-align:left; min-width:600px;">
        <tr style="background:#334155;"><th style="padding:15px;">Client</th><th style="padding:15px;">Status</th><th style="padding:15px;">Cost</th></tr>
        ${logs.rows.map(l => `<tr style="border-bottom:1px solid #334155;"><td style="padding:15px;">${l.customer_name}<br><small>📍 ${l.customer_location}</small></td><td style="padding:15px;">${l.status}</td><td style="padding:15px;">$${l.cost}</td></tr>`).join('')}
      </table>
    </div>
  `));
});

app.listen(SYSTEM_PORT, () => console.log(`🚀 Master Hub Live on Port ${SYSTEM_PORT}`));
