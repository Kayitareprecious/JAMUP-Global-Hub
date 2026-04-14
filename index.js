/**
 * @file index.js
 * @description Enterprise-Grade Management System for JAMUP Global Hub.
 * Features: Responsive UI (Mobile/Tablet), Master Admin Security,
 * Multi-Page Architecture, and Real-Time Business Analytics.
 *
 * @author JAMUP Technical Development Team
 * @version 5.0.0
 */

const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

// ==========================================
// SYSTEM STATE & CONFIGURATION
// ==========================================
const app = express();
const SYSTEM_PORT = process.env.PORT || 3000;

/**
 * Global Middleware Configuration
 * Ensures the system handles complex data payloads and mobile requests.
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==========================================
// DATABASE INFRASTRUCTURE (PostgreSQL)
// ==========================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/**
 * Database Initialization Sequence
 * Verbose logic to build the business-critical tables.
 */
async function bootBusinessSchema() {
  try {
    console.log("[SYSTEM] Initiating Database Schema Sync...");

    // Core Repair Table
    const repairsTable = `
      CREATE TABLE IF NOT EXISTS repairs (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        customer_location TEXT,
        problem_details TEXT,
        cost INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Analytics Tracking Table
    const trafficTable = `
      CREATE TABLE IF NOT EXISTS traffic_logs (
        id SERIAL PRIMARY KEY,
        visitor_ip TEXT,
        user_agent TEXT,
        visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(repairsTable);
    await pool.query(trafficTable);
    console.log("[SYSTEM] ✅ Database Architecture Verified.");
  } catch (error) {
    console.error("[CRITICAL] Schema Error:", error.message);
  }
}
bootBusinessSchema();

// ==========================================
// SECURITY & AUTHENTICATION
// ==========================================
const AUTHORIZED_ADMINS = [
  "jabojulesmaurice@gmail.com",
  "gasnamoses01@gmail.com",
  "uwingabireange2003@gmail.com",
  "uwajenezaernestine2002@gmail.com",
  "kayitareprecious057@gmail.com",
];
const MASTER_KEY = "jamupglobal@2026";

// ==========================================
// SHARED UI COMPONENTS (RESPONSIVE)
// ==========================================
const UI_HEADER = `
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; font-family:'Segoe UI', sans-serif; background:#0f172a; color:white; }
    nav { display:flex; justify-content:space-between; align-items:center; padding:15px 5%; background:#1e293b; border-bottom:1px solid #334155; position:sticky; top:0; z-index:100; }
    nav a { color:white; text-decoration:none; margin-left:20px; font-size:14px; font-weight:bold; }
    .btn-admin { background:#38bdf8; color:#0f172a; padding:8px 15px; border-radius:5px; }
    .container { max-width:1100px; margin:auto; padding:20px; }
    .card { background:#1e293b; padding:25px; border-radius:15px; border:1px solid #334155; margin-bottom:20px; }
    input, textarea, select { width:100%; padding:12px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:8px; box-sizing:border-box; }
    button { background:#38bdf8; color:#0f172a; border:none; padding:15px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; }
    @media (max-width: 768px) {
      nav { padding: 15px 20px; }
      nav .links { display:none; }
      h1 { font-size:28px !important; }
    }
  </style>
  <nav>
    <h2 style="color:#38bdf8; margin:0;">JAMUP <span style="font-weight:lighter; color:white;">HUB</span></h2>
    <div class="links">
      <a href="/">HOME</a>
      <a href="/about">ABOUT</a>
      <a href="/contact">CONTACT</a>
      <a href="/admin-login" class="btn-admin">ADMIN</a>
    </div>
  </nav>
`;

const UI_FOOTER = `
  <footer style="background:#1e293b; padding:30px; text-align:center; border-top:1px solid #334155; color:#94a3b8; font-size:13px; margin-top:50px;">
    &copy; ${new Date().getFullYear()} JAMUP Global Hub. Professional Electronics Services. All rights reserved.
  </footer>
`;

// ==========================================
// PUBLIC ROUTES (HOME, ABOUT, CONTACT, USER)
// ==========================================

// --- HOME PAGE ---
app.get("/", async (req, res) => {
  await pool.query(
    "INSERT INTO traffic_logs (visitor_ip, user_agent) VALUES ($1, $2)",
    [req.ip, req.headers["user-agent"]],
  );
  res.send(`
    ${UI_HEADER}
    <div class="container" style="text-align:center; padding-top:50px;">
      <h1 style="font-size:48px;">The Future of <span style="color:#38bdf8;">Repair</span>.</h1>
      <p style="color:#94a3b8; font-size:18px;">Phones • Laptops • CCTV • Technical Support</p>
      <img src="https://unsplash.com" style="width:100%; max-width:600px; border-radius:20px; margin:30px 0; border:4px solid #1e293b;">
      <div class="card" style="max-width:450px; margin:auto; text-align:left;">
        <h2 style="color:#38bdf8; margin-top:0;">Book a Service</h2>
        <form action="/submit-request" method="POST">
          <input name="name" placeholder="Full Name" required>
          <input name="location" placeholder="Location (e.g. Muhoza)" required>
          <textarea name="problem" placeholder="Describe the device problem..." required></textarea>
          <button type="submit">SUBMIT REQUEST</button>
        </form>
      </div>
    </div>
    ${UI_FOOTER}
  `);
});

// --- ABOUT PAGE ---
app.get("/about", (req, res) => {
  res.send(`
    ${UI_HEADER}
    <div class="container">
      <h1>About <span style="color:#38bdf8;">JAMUP HUB</span></h1>
      <div class="card">
        <p>Founded by the Elite Five technical experts, JAMUP Global Hub is Musanze's premier destination for high-end electronics repair and industrial instrument maintenance.</p>
        <p>Our mission is to empower youth through technology while providing professional, reliable services to our community.</p>
      </div>
    </div>
    ${UI_FOOTER}
  `);
});

// --- CONTACT PAGE ---
app.get("/contact", (req, res) => {
  res.send(`
    ${UI_HEADER}
    <div class="container">
      <h1>Contact <span style="color:#38bdf8;">Our Experts</span></h1>
      <div class="card">
        <h3>Email Us</h3><p>jamupglobal@gmail.com</p>
        <h3>Visit Us</h3><p>Musanze Main Street, Rwanda</p>
      </div>
    </div>
    ${UI_FOOTER}
  `);
});

// ==========================================
// ADMIN MODULES (LOGIN & DASHBOARD)
// ==========================================

app.get("/admin-login", (req, res) => {
  res.send(`
    ${UI_HEADER}
    <div class="container" style="text-align:center; padding-top:100px;">
      <div class="card" style="max-width:350px; margin:auto; text-align:left;">
        <h2 style="color:#38bdf8; margin-top:0;">Elite Five Gateway</h2>
        <form action="/admin-dashboard" method="POST">
          <input type="email" name="email" placeholder="Admin Email" required>
          <input type="password" name="password" placeholder="Master Password" required>
          <button type="submit">AUTHENTICATE</button>
        </form>
      </div>
    </div>
    ${UI_FOOTER}
  `);
});

app.post("/admin-dashboard", async (req, res) => {
  const { email, password } = req.body;
  if (!AUTHORIZED_ADMINS.includes(email) || password !== MASTER_KEY) {
    return res
      .status(403)
      .send("<h1>Access Denied</h1><a href='/admin-login'>Back</a>");
  }

  const clients = await pool.query("SELECT COUNT(*) as count FROM repairs");
  const traffic = await pool.query(
    "SELECT COUNT(*) as count FROM traffic_logs",
  );
  const revenue = await pool.query("SELECT SUM(cost) as total FROM repairs");
  const jobs = await pool.query(
    "SELECT * FROM repairs ORDER BY created_at DESC",
  );

  let tableRows = jobs.rows
    .map(
      (j) => `
    <tr style="border-bottom:1px solid #334155;">
      <td style="padding:15px;"><b>${j.customer_name}</b><br><small style="color:#38bdf8;">📍 ${j.customer_location}</small></td>
      <td style="padding:15px; color:#22c55e;">$${j.cost || 0}</td>
      <td style="padding:15px;">
        <form action="/update-status/${j.id}" method="POST" style="margin:0;">
          <input type="hidden" name="email" value="${email}">
          <select name="status" onchange="this.form.submit()" style="padding:5px; background:#0f172a; color:white; border-radius:5px;">
            <option ${j.status === "Pending" ? "selected" : ""}>Pending</option>
            <option ${j.status === "Fixed" ? "selected" : ""}>Fixed</option>
            <option ${j.status === "Delivered" ? "selected" : ""}>Delivered</option>
          </select>
        </form>
      </td>
    </tr>
  `,
    )
    .join("");

  res.send(`
    ${UI_HEADER}
    <div class="container">
      <h1>Master <span style="color:#38bdf8;">Analytics</span></h1>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-bottom:30px;">
        <div class="card" style="border-left:5px solid #38bdf8;"><h3>Clients</h3><p style="font-size:32px; font-weight:bold;">${clients.rows[0].count}</p></div>
        <div class="card" style="border-left:5px solid #22c55e;"><h3>Revenue</h3><p style="font-size:32px; font-weight:bold; color:#22c55e;">$${revenue.rows[0].total || 0}</p></div>
        <div class="card" style="border-left:5px solid #f59e0b;"><h3>Visits</h3><p style="font-size:32px; font-weight:bold;">${traffic.rows[0].count}</p></div>
      </div>
      <div class="card">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <tr style="background:#334155;"><th style="padding:15px;">Client</th><th style="padding:15px;">Cost</th><th style="padding:15px;">Status</th></tr>
          ${tableRows || '<tr><td colspan="3" style="text-align:center; padding:20px;">No records.</td></tr>'}
        </table>
      </div>
    </div>
    ${UI_FOOTER}
  `);
});

// --- 🚀 BACKEND PROCESSING ---

/**
 * Handles professional repair booking submissions.
 * Includes verbose try/catch blocks and explicit database column mapping.
 */
app.post("/submit-request", async (req, res) => {
  const { name, location, problem } = req.body;

  try {
    // Explicit Database Insertion Logic
    const insertQuery =
      "INSERT INTO repairs (customer_name, customer_location, problem_details) VALUES ($1, $2, $3)";
    const queryValues = [name, location, problem];

    await pool.query(insertQuery, queryValues);

    // Success UI: Optimized for Mobile, Tablet, and Desktop
    res.send(`
      ${UI_HEADER}
      <div class="container" style="text-align:center; padding-top:100px;">
        <div class="card" style="border-top: 5px solid #38bdf8;">
          <h1 style="color:#38bdf8; font-size: 32px;">Request Synchronized!</h1>
          <p style="font-size: 18px; color: #94a3b8;">The JAMUP Elite Team has successfully received your repair details.</p>
          <a href="/" style="background:#38bdf8; color:#0f172a; padding:12px 25px; border-radius:8px; text-decoration:none; font-weight:bold; display:inline-block; margin-top:20px;">← RETURN TO HOME</a>
        </div>
      </div>
      ${UI_FOOTER}
    `);
  } catch (error) {
    // Verbose Error Logging for Developer Diagnostics
    console.error("[CRITICAL_DATABASE_FAULT]", error.message);
    res
      .status(500)
      .send("<h1>Database Fault</h1><p>Error: " + error.message + "</p>");
  }
});

// ==========================================
// 🚀 VISITOR BOOKING LOGIC (FIXES 502 ERROR)
// ==========================================
/**
 * Handles the "Book a Service" form from the home page.
 * Verbose logic ensures visitor data is captured in the PostgreSQL database.
 */
app.post("/submit-request", async (req, res) => {
  const { name, location, problem } = req.body;
  try {
    // Logic: Inserting data into the verified repairs table
    await pool.query(
      "INSERT INTO repairs (customer_name, customer_location, problem_details) VALUES ($1, $2, $3)",
      [name, location, problem],
    );
    res.send(`
      ${UI_HEADER}
      <div class="container" style="text-align:center; padding-top:100px;">
        <div class="card">
          <h1 style="color:#38bdf8;">Request Received!</h1>
          <p>The JAMUP Elite Team has been notified of your request.</p>
          <a href="/" style="color:#38bdf8; text-decoration:none; font-weight:bold;">← BACK TO HOME</a>
        </div>
      </div>
      ${UI_FOOTER}
    `);
  } catch (error) {
    console.error("[SUBMISSION_ERROR]", error.message);
    res
      .status(500)
      .send(
        "<h1>Database Fault</h1><p>The Hub was unable to sync your request.</p>",
      );
  }
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
app.listen(SYSTEM_PORT, () => {
  console.log(`🚀 JAMUP Global Master Hub is Active on Port ${SYSTEM_PORT}`);
});
