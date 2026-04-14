/**
 * @file index.js
 * @description JAMUP Global HUB - Enterprise Master Engine.
 * Features: Auto-Healing Database, Responsive Mobile UI, Master Analytics.
 * @author JAMUP Technical Team
 */

const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const SYSTEM_PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ==========================================
// 🛡️ AUTO-HEALING DATABASE LOGIC
// ==========================================
async function ensureDatabaseStability() {
  try {
    // This logic gate checks and fixes your table structure automatically
    await pool.query(`
      CREATE TABLE IF NOT EXISTS repairs (
        id SERIAL PRIMARY KEY,
        customer_name TEXT,
        customer_location TEXT,
        problem_details TEXT,
        status TEXT DEFAULT 'Pending',
        cost INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS traffic_logs (
        id SERIAL PRIMARY KEY,
        visitor_ip TEXT,
        user_agent TEXT,
        visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ JAMUP Master Engine: Database Link Synchronized.");
  } catch (err) {
    console.error("❌ Link Error:", err.message);
  }
}
ensureDatabaseStability();

// ==========================================
// 🔐 SECURITY & UI CONFIGURATION
// ==========================================
const AUTHORIZED_ADMINS = ["jabojulesmaurice@gmail.com", "gasnamoses01@gmail.com", "uwingabireange2003@gmail.com", "uwajenezaernestine2002@gmail.com", "kayitareprecious057@gmail.com"];
const MASTER_KEY = "jamupglobal@2026";

const UI_SHELL = (content, title = "JAMUP HUB") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin:0; font-family:'Segoe UI', sans-serif; background:#0f172a; color:white; display:flex; flex-direction:column; min-height:100vh; }
    nav { display:flex; justify-content:space-between; align-items:center; padding:15px 5%; background:#1e293b; border-bottom:1px solid #334155; position:sticky; top:0; z-index:1000; }
    nav a { color:white; text-decoration:none; font-weight:bold; font-size:14px; margin-left:15px; }
    .container { max-width:1100px; margin:auto; padding:20px; flex:1; width:100%; box-sizing:border-box; }
    .card { background:#1e293b; padding:30px; border-radius:15px; border:1px solid #334155; margin-bottom:20px; }
    .btn { background:#38bdf8; color:#0f172a; border:none; padding:12px 25px; border-radius:8px; font-weight:bold; cursor:pointer; text-decoration:none; display:inline-block; }
    input, textarea, select { width:100%; padding:12px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:8px; box-sizing:border-box; }
    footer { background:#1e293b; padding:25px; text-align:center; border-top:1px solid #334155; color:#94a3b8; font-size:13px; }
    @media (max-width: 768px) { nav { padding:15px 20px; } .mobile-hide { display:none; } h1 { font-size:32px !important; } }
  </style>
</head>
<body>
  <nav>
    <h2 style="color:#38bdf8; margin:0;" onclick="location.href='/'">JAMUP <span style="color:white; font-weight:lighter;">GLOBAL</span></h2>
    <div>
      <a href="/" class="mobile-hide">HOME</a>
      <a href="/about" class="mobile-hide">ABOUT</a>
      <a href="/contact" class="mobile-hide">CONTACT</a>
      <a href="/admin-login" style="background:#38bdf8; color:#0f172a; padding:8px 18px; border-radius:5px; margin-left:10px;">ADMIN</a>
    </div>
  </nav>
  <div class="container">${content}</div>
  <footer>&copy; ${new Date().getFullYear()} JAMUP Global Hub. All rights reserved.</footer>
</body>
</html>
`;

// ==========================================
// 🏠 PUBLIC PAGES (MOBILE READY)
// ==========================================
app.get('/', async (req, res) => {
  try { await pool.query('INSERT INTO traffic_logs (visitor_ip, user_agent) VALUES ($1, $2)', [req.ip, req.headers['user-agent']]); } catch (e) {}
  res.send(UI_SHELL(`
    <div style="text-align:center; padding:40px 0;">
      <h1>Expert Tech <span style="color:#38bdf8;">Solutions</span>.</h1>
      <p style="color:#94a3b8; font-size:19px; max-width:700px; margin:auto;">Specialized repairs for Smartphones, Laptops, and CCTV Infrastructure.</p>
      <img src="https://unsplash.com" style="width:100%; max-width:500px; border-radius:20px; margin:30px 0; border:4px solid #1e293b;">
      <div class="card" style="max-width:450px; margin:auto; text-align:left;">
        <h2 style="color:#38bdf8; margin-top:0;">Book a Service</h2>
        <form action="/submit-request" method="POST">
          <input name="name" placeholder="Full Name" required>
          <input name="location" placeholder="Your Neighborhood" required>
          <textarea name="problem" placeholder="Describe the device problem..." required style="height:100px; resize:none;"></textarea>
          <button type="submit" class="btn" style="width:100%;">SUBMIT TO HUB</button>
        </form>
      </div>
    </div>
  `));
});

app.get('/about', (req, res) => { res.send(UI_SHELL(`<h1>About <span style="color:#38bdf8;">The Hub</span></h1><div class="card"><p>JAMUP Global is Musanze's premier technical facility, powered by the Elite Five experts.</p></div>`)); });
app.get('/contact', (req, res) => { res.send(UI_SHELL(`<h1>Contact <span style="color:#38bdf8;">Experts</span></h1><div class="card"><h3>Official Email</h3><p>jamupglobal@gmail.com</p><h3>Address</h3><p>Main Street, Musanze, Rwanda</p></div>`)); });

// ==========================================
// 🚀 BACKEND PROCESSING
// ==========================================
// --- CONFIRMED FORM SUBMISSION ---
app.post('/submit-request', async (req, res) => {
  const { name, location, problem } = req.body;
  try {
    // These names match your shell output: customer_name, customer_location, problem_details
    const insertQuery = "INSERT INTO repairs (customer_name, customer_location, problem_details) VALUES ($1, $2, $3)";
    await pool.query(insertQuery, [name, location, problem]);

    res.send(UI_SHELL(`
      <h1 style="color:#38bdf8;">Request Received!</h1>
      <p>The JAMUP team will contact you soon.</p>
      <a href="/" class="btn">Back Home</a>
    `));
  } catch (err) {
    // This will tell us if Render is still seeing a different database
    console.error("DB Error on Render:", err.message);
    res.status(500).send(UI_SHELL(`<h1>Database Fault</h1><p>The server said: ${err.message}</p>`));
  }
});


// ==========================================
// 🔐 MASTER ADMIN DASHBOARD
// ==========================================
app.get('/admin-login', (req, res) => {
  res.send(UI_SHELL(`
    <div style="max-width:350px; margin:100px auto;">
      <div class="card">
        <h2 style="color:#38bdf8; margin-top:0;">Elite Gate</h2>
        <form action="/dashboard" method="POST">
          <input type="email" name="email" placeholder="Founder Email" required>
          <input type="password" name="password" placeholder="Master Password" required>
          <button type="submit" class="btn" style="width:100%;">AUTHENTICATE</button>
        </form>
      </div>
    </div>
  `));
});

app.post('/dashboard', async (req, res) => {
  const { email, password } = req.body;
  if (!AUTHORIZED_ADMINS.includes(email) || password !== MASTER_KEY) return res.status(403).send(UI_SHELL("<h1>Access Denied</h1>"));

  const clients = await pool.query('SELECT COUNT(*) as count FROM repairs');
  const revenue = await pool.query('SELECT SUM(cost) as total FROM repairs');
  const logs = await pool.query('SELECT * FROM repairs ORDER BY created_at DESC');

  res.send(UI_SHELL(`
    <h1>Master <span style="color:#38bdf8;">Analytics</span></h1>
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-bottom:30px;">
      <div class="card"><h3>Total Clients</h3><p style="font-size:32px; font-weight:bold;">${clients.rows[0].count}</p></div>
      <div class="card"><h3>Total Revenue</h3><p style="font-size:32px; font-weight:bold; color:#22c55e;">$${revenue.rows[0].total || 0}</p></div>
    </div>
    <div class="card" style="padding:0; overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <tr style="background:#334155;"><th style="padding:15px;">Client Profile</th><th style="padding:15px;">Task</th><th style="padding:15px;">Status</th></tr>
        ${logs.rows.map(j => `<tr style="border-bottom:1px solid #334155;"><td style="padding:15px;">${j.customer_name}<br><small>📍 ${j.customer_location}</small></td><td style="padding:15px;">${j.problem_details}</td><td style="padding:15px;">${j.status}</td></tr>`).join('')}
      </table>
    </div>
  `));
});

app.listen(SYSTEM_PORT, () => console.log(`🚀 Master HUB Active on Port ${SYSTEM_PORT}`));
