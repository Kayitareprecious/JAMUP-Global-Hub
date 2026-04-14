/**
 * @file index.js
 * @description Master Control Engine for JAMUP Global HUB.
 * Features: Multi-Device Responsive UI, Master Admin Auth, and Business Analytics.
 * @author JAMUP Technical Team
 */

const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const SYSTEM_PORT = process.env.PORT || 3000; // FIX: Critical for Render 502 errors

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- 🗄️ DATABASE INFRASTRUCTURE ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// --- 🔐 SECURITY PROTOCOL ---
const ELITE_FIVE = [
  "jabojulesmaurice@gmail.com",
  "gasnamoses01@gmail.com",
  "uwingabireange2003@gmail.com",
  "uwajenezaernestine2002@gmail.com",
  "kayitareprecious057@gmail.com",
];
const MASTER_PASS = "jamupglobal@2026";

// --- 🎨 RESPONSIVE UI TEMPLATE ---
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
    nav a { color:white; text-decoration:none; font-weight:bold; font-size:14px; margin-left:20px; }
    .container { max-width:1100px; margin:auto; padding:20px; flex:1; width:100%; box-sizing:border-box; }
    .card { background:#1e293b; padding:30px; border-radius:15px; border:1px solid #334155; margin-bottom:20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    .btn { background:#38bdf8; color:#0f172a; border:none; padding:12px 25px; border-radius:8px; font-weight:bold; cursor:pointer; text-decoration:none; display:inline-block; }
    input, textarea { width:100%; padding:12px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:8px; box-sizing:border-box; }
    footer { background:#1e293b; padding:25px; text-align:center; border-top:1px solid #334155; color:#94a3b8; font-size:13px; }
    @media (max-width: 768px) { nav { padding:15px 20px; } .mobile-hide { display:none; } h1 { font-size:32px !important; } }
  </style>
</head>
<body>
  <nav>
    <h2 style="color:#38bdf8; margin:0;">JAMUP <span style="color:white; font-weight:lighter;">GLOBAL</span></h2>
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

// --- 🏠 ROUTES ---
app.get("/", (req, res) => {
  res.send(
    UI_SHELL(`
    <div style="text-align:center; padding:40px 0;">
      <h1 style="font-size:54px; margin-bottom:15px;">Elite Tech <span style="color:#38bdf8;">Solutions</span>.</h1>
      <img src="https://unsplash.com" style="width:100%; max-width:500px; border-radius:20px; margin:30px 0; border:4px solid #1e293b;">
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
  `),
  );
});

app.post("/submit-request", async (req, res) => {
  const { name, location, problem } = req.body;
  try {
    // These names MUST match the shell command: customer_name, location, customer_request
    await pool.query(
      "INSERT INTO repairs (customer_name, location, customer_request) VALUES ($1, $2, $3)",
      [name, location, problem],
    );
    res.send(
      UI_SHELL(`
      <h1 style="color:#38bdf8;">Success!</h1>
      <p>The JAMUP team will contact you soon.</p>
      <a href="/" class="btn">Back Home</a>
    `),
    );
  } catch (err) {
    console.error("Database Fault:", err.message);
    res.status(500).send("Database Fault: " + err.message);
  }
});

app.get("/admin-login", (req, res) => {
  res.send(
    UI_SHELL(`
    <div style="max-width:350px; margin:100px auto;">
      <div class="card">
        <h2 style="color:#38bdf8; margin:0;">Admin Access</h2>
        <form action="/dashboard" method="POST">
          <input type="email" name="email" placeholder="Admin Email" required style="width:100%; padding:10px; margin-bottom:10px;">
          <input type="password" name="password" placeholder="Master Password" required style="width:100%; padding:10px; margin-bottom:10px;">
          <button type="submit" class="btn" style="width:100%; font-weight:bold; cursor:pointer;">LOGIN</button>
        </form>
      </div>
    </div>
  `),
  );
});
// ==========================================
// 📊 ENTERPRISE ANALYTICS & PDF GENERATION
// ==========================================
/**
 * Route: Generates a professional Master Report.
 * Verbose logic to fetch all database records and format them for the Elite Five.
 */
app.get("/generate-report", async (req, res) => {
  const { email } = req.query;

  // Security Gate: Only the Elite Five can generate reports
  if (!AUTHORIZED_ADMINS.includes(email)) {
    return res
      .status(403)
      .send(
        "<h1>Access Denied</h1><p>You are not authorized to view the Master Report.</p>",
      );
  }

  try {
    const reportData = await pool.query(
      "SELECT * FROM repairs ORDER BY created_at DESC",
    );

    // UI: Professional Print-Ready Report View
    res.send(`
      <body style="font-family:'Segoe UI', sans-serif; padding:40px; color:#1e293b; background:#f8fafc;">
        <div style="max-width:900px; margin:auto; background:white; padding:40px; border-radius:10px; box-shadow:0 0 20px rgba(0,0,0,0.1);">
          <h1 style="color:#0f172a; border-bottom:3px solid #38bdf8; padding-bottom:10px; margin-top:0;">JAMUP GLOBAL HUB - MASTER REPORT</h1>
          <p style="font-weight:bold; color:#64748b;">Report Generation Date: ${new Date().toLocaleString()}</p>
          <table border="1" style="width:100%; border-collapse:collapse; margin-top:30px; border-color:#e2e8f0;">
            <tr style="background:#f1f5f9; text-align:left;">
              <th style="padding:12px;">Client Name</th><th style="padding:12px;">Location</th><th style="padding:12px;">Service Task</th><th style="padding:12px;">Status</th><th style="padding:12px;">Cost</th>
            </tr>
            ${reportData.rows
              .map(
                (r) => `
              <tr>
                <td style="padding:12px;">${r.customer_name}</td>
                <td style="padding:12px;">${r.location}</td>
                <td style="padding:12px;">${r.customer_request}</td>
                <td style="padding:12px;">${r.status}</td>
                <td style="padding:12px; font-weight:bold; color:#16a34a;">$${r.cost || 0}</td>
              </tr>
            `,
              )
              .join("")}
          </table>
          <div style="margin-top:40px; text-align:center;">
            <button onclick="window.print()" style="padding:12px 30px; background:#38bdf8; color:#0f172a; border:none; border-radius:5px; cursor:pointer; font-weight:bold; text-transform:uppercase;">Print Report / Save as PDF</button>
            <br><br>
            <a href="/admin-dashboard?email=${email}" style="color:#64748b; font-size:14px;">Return to Dashboard</a>
          </div>
        </div>
      </body>
    `);
  } catch (err) {
    console.error("[REPORT_ERROR]", err.message);
    res.status(500).send("Critical Fault in Report Generation Engine.");
  }
});
// ==========================================
// 📊 MASTER ADMIN DASHBOARD (ANALYTICS)
// ==========================================
/**
 * Route: Private Hub for the Elite Five.
 * Verbose logic validates credentials and calculates real-time business revenue.
 */
app.post("/dashboard", async (req, res) => {
  const { email, password } = req.body;

  // Security Gate: Explicit validation of Elite Five & Master Password
  if (!AUTHORIZED_ADMINS.includes(email) || password !== MASTER_KEY) {
    return res.status(403).send(
      UI_SHELL(`
      <div style="text-align:center; padding-top:100px;">
        <h1 style="color:#ef4444;">403: Access Denied</h1>
        <p>Credentials not recognized in the JAMUP Elite Registry.</p>
        <a href="/admin-login" class="btn">Return to Gateway</a>
      </div>
    `),
    );
  }

  try {
    const clientsData = await pool.query(
      "SELECT COUNT(*) as count FROM repairs",
    );
    const revenueData = await pool.query(
      "SELECT SUM(cost) as total FROM repairs",
    );
    const repairsLog = await pool.query(
      "SELECT * FROM repairs ORDER BY created_at DESC",
    );

    // UI Engine: Professional Analytics Dashboard (Responsive for Mobile/Tablet)
    res.send(
      UI_SHELL(`
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <h1 style="margin:0;">Master <span style="color:#38bdf8;">Analytics</span> Hub</h1>
        <a href="/generate-report?email=${email}" class="btn" style="font-size:12px; padding:10px 20px;">GENERATE MASTER PDF</a>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin:30px 0;">
        <div class="card" style="border-left:5px solid #38bdf8; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
          <h3 style="color:#94a3b8; font-size:12px; text-transform:uppercase; margin:0;">Active Clients</h3>
          <p style="font-size:36px; font-weight:bold; margin:10px 0;">${clientsData.rows[0].count}</p>
        </div>
        <div class="card" style="border-left:5px solid #22c55e; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
          <h3 style="color:#94a3b8; font-size:12px; text-transform:uppercase; margin:0;">Total Revenue</h3>
          <p style="font-size:36px; font-weight:bold; margin:10px 0; color:#22c55e;">$${revenueData.rows[0].total || 0}</p>
        </div>
      </div>

      <div class="card" style="padding:0; overflow-x:auto; border-radius:15px; border:1px solid #334155;">
        <table style="width:100%; border-collapse:collapse; text-align:left; min-width:700px;">
          <tr style="background:#334155; color:#cbd5e1; text-transform:uppercase; font-size:12px;">
            <th style="padding:15px;">Client Profile</th><th style="padding:15px;">Service Task</th><th style="padding:15px;">Revenue</th><th style="padding:15px;">Status</th>
          </tr>
          ${repairsLog.rows
            .map(
              (row) => `
            <tr style="border-bottom:1px solid #334155; transition: 0.3s;">
              <td style="padding:15px;"><b>${row.customer_name}</b><br><small style="color:#38bdf8;">📍 ${row.customer_location || "Musanze"}</small></td>
              <td style="padding:15px;">${row.problem_details}</td>
              <td style="padding:15px; color:#22c55e; font-weight:bold;">$${row.cost}</td>
              <td style="padding:15px;"><span style="background:#0f172a; padding:5px 12px; border-radius:6px; font-size:12px; font-weight:bold;">${row.status}</span></td>
            </tr>
          `,
            )
            .join("")}
        </table>
      </div>
    `),
    );
  } catch (err) {
    console.error("[DASHBOARD_FAULT]", err.message);
    res.status(500).send("Master Dashboard Failure: Synchronize Database.");
  }
});

app.listen(SYSTEM_PORT, () =>
  console.log(`🚀 Master Hub Live on Port ${SYSTEM_PORT}`),
);
