/**
 * @file index.js
 * @description Master Control Engine for JAMUP Global HUB.
 * Features: Responsive Mobile UI, Elite Five Security, Multi-Page Navigation, 
 * and Master Analytics Database Integration.
 * @author JAMUP Technical Development Team
 * @version 5.0.0
 */

const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const SYSTEM_PORT = process.env.PORT || 3000;

// VERBOSE MIDDLEWARE CONFIGURATION
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- 🗄️ DATABASE INFRASTRUCTURE ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// --- 🔐 THE ELITE FIVE SECURITY PROTOCOL ---
const AUTHORIZED_ADMINS = [
  "jabojulesmaurice@gmail.com", "gasnamoses01@gmail.com",
  "uwingabireange2003@gmail.com", "uwajenezaernestine2002@gmail.com",
  "kayitareprecious057@gmail.com"
];
const MASTER_KEY = "jamupglobal@2026";

// --- 🎨 RESPONSIVE UI SHELL (DARK MODE) ---
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
    nav a { color:white; text-decoration:none; font-weight:bold; font-size:14px; margin-left:20px; transition:0.3s; }
    nav a:hover { color:#38bdf8; }
    .container { max-width:1100px; margin:auto; padding:20px; flex:1; width:100%; box-sizing:border-box; }
    .card { background:#1e293b; padding:30px; border-radius:15px; border:1px solid #334155; margin-bottom:20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    .btn { background:#38bdf8; color:#0f172a; border:none; padding:12px 25px; border-radius:8px; font-weight:bold; cursor:pointer; text-decoration:none; display:inline-block; transition: 0.3s; }
    .btn:hover { background:#7dd3fc; transform: translateY(-2px); }
    input, textarea, select { width:100%; padding:12px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:8px; box-sizing:border-box; }
    footer { background:#1e293b; padding:25px; text-align:center; border-top:1px solid #334155; color:#94a3b8; font-size:13px; }
    @media (max-width: 768px) { nav { padding:15px 20px; } .mobile-hide { display:none; } h1 { font-size:32px !important; } }
  </style>
</head>
<body>
  <nav>
    <h2 style="color:#38bdf8; margin:0; cursor:pointer;" onclick="location.href='/'">JAMUP <span style="color:white; font-weight:lighter;">GLOBAL</span></h2>
    <div>
      <a href="/" class="mobile-hide">HOME</a>
      <a href="/about" class="mobile-hide">ABOUT</a>
      <a href="/contact" class="mobile-hide">CONTACT</a>
      <a href="/admin-login" style="background:#38bdf8; color:#0f172a; padding:8px 18px; border-radius:5px; margin-left:10px;">ADMIN</a>
    </div>
  </nav>
  <div class="container">${content}</div>
  <footer>&copy; ${new Date().getFullYear()} JAMUP Global Hub. All rights reserved. | 📍 Musanze, Rwanda</footer>
</body>
</html>
`;

// --- 🏠 PUBLIC ROUTES ---

app.get('/', async (req, res) => {
  try { await pool.query('INSERT INTO traffic_logs (visitor_ip, user_agent) VALUES ($1, $2)', [req.ip, req.headers['user-agent']]); } catch (e) {}
  res.send(UI_SHELL(`
    <div style="text-align:center; padding:40px 0;">
      <h1 style="font-size:54px; margin-bottom:15px; font-weight:800; letter-spacing:-1px;">Elite Tech <span style="color:#38bdf8;">Solutions</span>.</h1>
      <p style="color:#94a3b8; font-size:20px; max-width:700px; margin:0 auto 40px auto; line-height:1.6;">Precision repairs for Smartphones, Laptops, Industrial Systems, and CCTV Infrastructure.</p>

      <div style="display:flex; justify-content:center; gap:20px; flex-wrap:wrap; margin-bottom:50px;">
        <img src="https://unsplash.com" style="width:280px; height:200px; border-radius:12px; object-fit:cover; border:2px solid #1e293b;" alt="Electronics Repair">
        <img src="https://unsplash.com" style="width:280px; height:200px; border-radius:12px; object-fit:cover; border:2px solid #38bdf8;" alt="Team Collaboration">
      </div>

      <div class="card" style="max-width:450px; margin:auto; text-align:left;">
        <h2 style="color:#38bdf8; margin-top:0;">Book a Service Request</h2>
        <form action="/submit-request" method="POST">
          <label style="font-size:12px; color:#94a3b8; text-transform:uppercase;">Full Name</label>
          <input name="name" required placeholder="John Doe">

          <label style="font-size:12px; color:#94a3b8; text-transform:uppercase;">Neighborhood/Location</label>
          <input name="location" required placeholder="e.g. Muhoza, Musanze">

          <label style="font-size:12px; color:#94a3b8; text-transform:uppercase;">Device & Problem Details</label>
          <textarea name="problem" required placeholder="Describe the issue..." style="height:100px; resize:none;"></textarea>

          <button type="submit" class="btn" style="width:100%;">SEND TO HUB</button>
        </form>
      </div>
    </div>
  `));
});

app.get('/about', (req, res) => {
  res.send(UI_SHELL(`
    <h1>About <span style="color:#38bdf8;">JAMUP HUB</span></h1>
    <div class="card" style="line-height:1.8; font-size:17px;">
      <p>JAMUP Global Hub is a specialized electronics repair facility powered by the Elite Five technicians. Located in the heart of Musanze, we specialize in high-end diagnostics, hardware restoration, and networking infrastructure.</p>
      <p>Our goal is to provide the fastest, most reliable technical support in Rwanda using modern precision instrumentation.</p>
    </div>
  `));
});

app.get('/contact', (req, res) => {
  res.send(UI_SHELL(`
    <h1>Contact <span style="color:#38bdf8;">The Hub</span></h1>
    <div class="card">
      <h3 style="margin-top:0;">Official Email</h3><p style="color:#38bdf8;">jamupglobal@gmail.com</p>
      <hr style="border:0; border-top:1px solid #334155; margin:20px 0;">
      <h3>Musanze Headquarters</h3><p>Main Street, Musanze District, Northern Province, Rwanda</p>
      <h3>Working Hours</h3><p>Monday - Saturday: 8:00 AM - 6:00 PM</p>
    </div>
  `));
});

// --- 🚀 BACKEND LOGIC (FORM PROCESSING) ---

app.post('/submit-request', async (req, res) => {
  const { name, location, problem } = req.body;
  try {
    // Explicitly mapping variables to the professional database columns
    await pool.query(
      'INSERT INTO repairs (customer_name, customer_location, problem_details) VALUES ($1, $2, $3)',
      [name, location, problem]
    );
    res.send(UI_SHELL(`
      <div style="text-align:center; padding:100px 20px;">
        <h1 style="color:#38bdf8; font-size:42px;">Request Synchronized!</h1>
        <p style="font-size:18px; color:#94a3b8;">The JAMUP team will contact you shortly to confirm your service.</p>
        <a href="/" class="btn" style="margin-top:20px;">← BACK TO HOME</a>
      </div>
    `));
  } catch (err) {
    console.error("Database Fault:", err.message);
    res.status(500).send(UI_SHELL(`<h1>Database Link Fault</h1><p>The server was unable to save your request. Error: ${err.message}</p>`));
  }
});

// --- 🔐 MASTER ADMIN ANALYTICS ---

app.get('/admin-login', (req, res) => {
  res.send(UI_SHELL(`
    <div style="max-width:350px; margin:80px auto;">
      <div class="card" style="text-align:center;">
        <h2 style="color:#38bdf8; margin-top:0;">Elite Gate</h2>
        <p style="color:#94a3b8; font-size:13px; margin-bottom:25px;">Enter authorized credentials to access the master dashboard.</p>
        <form action="/dashboard" method="POST" style="text-align:left;">
          <label style="font-size:12px; color:#94a3b8;">Founder Email</label>
          <input type="email" name="email" required placeholder="admin@jamup.com">

          <label style="font-size:12px; color:#94a3b8;">Master Password</label>
          <input type="password" name="password" required>

          <button type="submit" class="btn" style="width:100%; margin-top:10px;">AUTHENTICATE</button>
        </form>
      </div>
    </div>
  `));
});

app.post('/dashboard', async (req, res) => {
  const { email, password } = req.body;

  // Security logic gate matching index.js credentials
  if (!AUTHORIZED_ADMINS.includes(email) || password !== MASTER_KEY) {
    return res.status(403).send(UI_SHELL(`<h1>Unauthorized</h1><p>Credentials not recognized.</p><a href="/admin-login" class="btn">Try Again</a>`));
  }

  try {
    const clients = await pool.query('SELECT COUNT(*) as count FROM repairs');
    const revenue = await pool.query('SELECT SUM(cost) as total FROM repairs');
    const traffic = await pool.query('SELECT COUNT(*) as count FROM traffic_logs');
    const logs = await pool.query('SELECT * FROM repairs ORDER BY created_at DESC');

    res.send(UI_SHELL(`
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <h1>Master <span style="color:#38bdf8;">Analytics</span></h1>
        <p style="margin:0; font-size:14px;">Authenticated: <b>${email}</b></p>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin:30px 0;">
        <div class="card" style="border-left:5px solid #38bdf8;"><h3>Total Clients</h3><p style="font-size:32px; font-weight:bold; margin:0;">${clients.rows[0].count}</p></div>
        <div class="card" style="border-left:5px solid #22c55e;"><h3>Hub Revenue</h3><p style="font-size:32px; font-weight:bold; margin:0; color:#22c55e;">$${revenue.rows[0].total || 0}</p></div>
        <div class="card" style="border-left:5px solid #f59e0b;"><h3>Traffic Awareness</h3><p style="font-size:32px; font-weight:bold; margin:0;">${traffic.rows[0].count}</p></div>
      </div>

      <div class="card" style="padding:0; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left; min-width:650px;">
          <tr style="background:#334155; text-transform:uppercase; font-size:12px;">
            <th style="padding:15px;">Client Profile</th>
            <th style="padding:15px;">Task Details</th>
            <th style="padding:15px;">Status</th>
            <th style="padding:15px;">Action</th>
          </tr>
          ${logs.rows.map(j => `
            <tr style="border-bottom:1px solid #334155;">
              <td style="padding:15px;"><b>${j.customer_name}</b><br><small style="color:#38bdf8;">📍 ${j.customer_location}</small></td>
              <td style="padding:15px; font-size:14px;">${j.problem_details}</td>
              <td style="padding:15px;"><span style="background:#0f172a; padding:5px 12px; border-radius:5px; font-size:11px; font-weight:bold;">${j.status}</span></td>
              <td style="padding:15px;">
                <form action="/update-status/${j.id}" method="POST" style="margin:0;">
                  <input type="hidden" name="email" value="${email}">
                  <select name="status" onchange="this.form.submit()" style="padding:5px; background:#0f172a; color:white; border:1px solid #475569; font-size:11px; border-radius:4px;">
                    <option ${j.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option ${j.status === 'Fixed' ? 'selected' : ''}>Fixed</option>
                    <option ${j.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                  </select>
                </form>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="4" style="padding:40px; text-align:center; color:#94a3b8;">No repair history found in the database.</td></tr>'}
        </table>
      </div>
    `));
  } catch (err) { res.status(500).send("Dashboard Failure: " + err.message); }
});

app.post('/update-status/:id', async (req, res) => {
  const { status, email } = req.body;
  try {
    await pool.query('UPDATE repairs SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.redirect(307, '/dashboard'); // Re-authenticates with email in body
  } catch (err) { res.send("Update Fault."); }
});

// --- 🏗️ SERVER STARTUP ---
app.listen(SYSTEM_PORT, () => {
  console.log(`🚀 Master Hub Live on Port ${SYSTEM_PORT}`);
});
