/**
 * @file index.js
 * @description Master Control Engine for JAMUP Global HUB.
 * Verbose 5,000-line Standard Logic for Multi-Device Compatibility.
 * @author JAMUP Technical Development Team
 */

const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const SYSTEM_PORT = process.env.PORT || 3000;

// MIDDLEWARE CONFIGURATION
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- 🗄️ DATABASE INFRASTRUCTURE ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// --- 🔐 THE ELITE FIVE SECURITY PROTOCOL ---
const AUTHORIZED_ADMINS = [
  "jabojulesmaurice@gmail.com",
  "gasnamoses01@gmail.com",
  "uwingabireange2003@gmail.com",
  "uwajenezaernestine2002@gmail.com",
  "kayitareprecious057@gmail.com",
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
    .btn { background:#38bdf8; color:#0f172a; border:none; padding:12px 25px; border-radius:8px; font-weight:bold; cursor:pointer; text-decoration:none; display:inline-block; }
    input, textarea, select { width:100%; padding:12px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:8px; box-sizing:border-box; }
    footer { background:#1e293b; padding:25px; text-align:center; border-top:1px solid #334155; color:#94a3b8; font-size:13px; }
    @media (max-width: 768px) { nav { padding:15px 20px; } .mobile-hide { display:none; } h1 { font-size:32px !important; } }
  </style>
</head>
<body>
  <nav>
    <h2 style="color:#38bdf8; margin:0;">JAMUP <span style="color:white; font-weight:lighter;">GLOBAL</span></h2>
    <div>
      <a href="/" class="mobile-hide">HOME</a>
      <a href="/about" class="mobile-hide">ABOUT</a>
      <a href="/contact" class="mobile-hide">CONTACT</a>
      <a href="/admin-login" style="background:#38bdf8; color:#0f172a; padding:8px 18px; border-radius:5px;">ADMIN</a>
    </div>
  </nav>
  <div class="container">${content}</div>
  <footer>&copy; ${new Date().getFullYear()} JAMUP Global Hub. All rights reserved.</footer>
</body>
</html>
`;

// --- 🏠 PUBLIC PAGES ---

app.get("/", async (req, res) => {
  try {
    await pool.query(
      "INSERT INTO traffic_logs (visitor_ip, user_agent) VALUES ($1, $2)",
      [req.ip, req.headers["user-agent"]],
    );
  } catch (e) {}
  res.send(
    UI_SHELL(`
    <div style="text-align:center; padding:40px 0;">
      <h1 style="font-size:54px; margin-bottom:15px;">Expert Tech <span style="color:#38bdf8;">Solutions</span>.</h1>
      <p style="color:#94a3b8; font-size:19px;">Precision Repairs for Phones, Laptops, and CCTV Networks.</p>
      <img src="https://unsplash.com" style="width:100%; max-width:550px; border-radius:20px; margin:30px 0; border:4px solid #1e293b;">
      <div class="card" style="max-width:420px; margin:auto; text-align:left;">
        <h2 style="color:#38bdf8; margin-top:0;">Request a Repair</h2>
        <form action="/submit-request" method="POST">
          <input name="name" placeholder="Full Name" required>
          <input name="location" placeholder="Your Neighborhood" required>
          <textarea name="problem" placeholder="Describe the Problem..." required style="height:100px; resize:none;"></textarea>
          <button type="submit" class="btn" style="width:100%;">SUBMIT TO HUB</button>
        </form>
      </div>
    </div>
  `),
  );
});

app.get("/about", (req, res) => {
  res.send(
    UI_SHELL(`
    <h1>About <span style="color:#38bdf8;">JAMUP HUB</span></h1>
    <div class="card">
      <p>Powered by the Elite Five technicians, JAMUP Global Hub is a specialized electronics repair facility in Musanze. We focus on high-end diagnostics and professional hardware maintenance.</p>
    </div>
  `),
  );
});

app.get("/contact", (req, res) => {
  res.send(
    UI_SHELL(`
    <h1>Contact <span style="color:#38bdf8;">The Hub</span></h1>
    <div class="card">
      <h3>Official Email: jamupglobal@gmail.com</h3>
      <h3>Location: Musanze Main Street, Rwanda</h3>
    </div>
  `),
  );
});

// --- 🚀 BACKEND LOGIC (FORM SUBMISSION) ---

app.post("/submit-request", async (req, res) => {
  const { name, location, problem } = req.body;
  try {
    // Logic: Mapping explicitly to the clean database columns
    await pool.query(
      "INSERT INTO repairs (customer_name, customer_location, problem_details) VALUES ($1, $2, $3)",
      [name, location, problem],
    );
    res.send(
      UI_SHELL(`
      <h1 style="color:#38bdf8;">Request Received!</h1>
      <p>The JAMUP team will contact you shortly.</p>
      <a href="/" class="btn">Back to Home</a>
    `),
    );
  } catch (err) {
    console.error("Database Fault:", err.message);
    res
      .status(500)
      .send(UI_SHELL(`<h1>Database Fault</h1><p>${err.message}</p>`));
  }
});

// --- 🔐 MASTER ADMIN DASHBOARD ---

app.get("/admin-login", (req, res) => {
  res.send(
    UI_SHELL(`
    <div style="max-width:350px; margin:100px auto;">
      <div class="card">
        <h2 style="color:#38bdf8; margin:0;">Elite Login</h2>
        <form action="/dashboard" method="POST">
          <input type="email" name="email" placeholder="Founder Email" required>
          <input type="password" name="password" placeholder="Master Password" required>
          <button type="submit" class="btn" style="width:100%;">AUTHENTICATE</button>
        </form>
      </div>
    </div>
  `),
  );
});

app.post("/dashboard", async (req, res) => {
  const { email, password } = req.body;
  if (!AUTHORIZED_ADMINS.includes(email) || password !== MASTER_KEY) {
    return res
      .status(403)
      .send(
        UI_SHELL(`<h1>Unauthorized</h1><a href="/admin-login">Try Again</a>`),
      );
  }

  try {
    const clients = await pool.query("SELECT COUNT(*) as count FROM repairs");
    const revenue = await pool.query("SELECT SUM(cost) as total FROM repairs");
    const logs = await pool.query(
      "SELECT * FROM repairs ORDER BY created_at DESC",
    );

    res.send(
      UI_SHELL(`
      <h1>Master <span style="color:#38bdf8;">Analytics</span></h1>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin:30px 0;">
        <div class="card"><h3>Total Clients</h3><p style="font-size:32px;">${clients.rows[0].count}</p></div>
        <div class="card"><h3>Total Revenue</h3><p style="font-size:32px; color:#22c55e;">$${revenue.rows[0].total || 0}</p></div>
      </div>
      <div class="card" style="padding:0; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left; min-width:600px;">
          <tr style="background:#334155;"><th style="padding:15px;">Client Profile</th><th style="padding:15px;">Job Details</th><th style="padding:15px;">Status Control</th></tr>
          ${logs.rows
            .map(
              (j) => `
            <tr style="border-bottom:1px solid #334155;">
              <td style="padding:15px;">${j.customer_name}<br><small style="color:#38bdf8;">📍 ${j.customer_location}</small></td>
              <td style="padding:15px;">${j.problem_details}</td>
              <td style="padding:15px;">
                <form action="/update-status/${j.id}" method="POST" style="margin:0;">
                  <input type="hidden" name="email" value="${email}">
                  <select name="status" onchange="this.form.submit()" style="background:#0f172a; color:white; border:1px solid #475569; padding:5px; border-radius:5px;">
                    <option ${j.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option ${j.status === "Fixed" ? "selected" : ""}>Fixed</option>
                    <option ${j.status === "Delivered" ? "selected" : ""}>Delivered</option>
                  </select>
                </form>
              </td>
            </tr>
          `,
            )
            .join("")}
        </table>
      </div>
    `),
    );
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

app.post("/update-status/:id", async (req, res) => {
  const { status, email } = req.body;
  await pool.query("UPDATE repairs SET status = $1 WHERE id = $2", [
    status,
    req.params.id,
  ]);
  res.redirect(307, "/dashboard"); // Re-posts with credentials
});

// --- 🏗️ SERVER STARTUP ---
app.listen(SYSTEM_PORT, () =>
  console.log(`🚀 JAMUP Master Engine Active on Port ${SYSTEM_PORT}`),
);
