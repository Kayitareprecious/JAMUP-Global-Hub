/**
 * @file index.js
 * @description Master Control Engine for JAMUP Global HUB.
 * Features: Multi-Layer Admin Auth, Visitor Tracking, and Professional Footer.
 * @author JAMUP Technical Development Team
 */

const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE CONFIGURATION
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- 🗄️ DATABASE INFRASTRUCTURE ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/**
 * DATABASE INITIALIZATION
 * Explicitly creates the business schema for repairs and analytics.
 */
async function initializeDatabase() {
  try {
    const schema = `
      CREATE TABLE IF NOT EXISTS repairs (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        location TEXT NOT NULL,
        problem_details TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS visitor_logs (
        id SERIAL PRIMARY KEY,
        visitor_ip TEXT,
        visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(schema);
    console.log("[SYSTEM] ✅ Database Schema Verified.");
  } catch (err) {
    console.error("[CRITICAL] DB Init Failed:", err.message);
  }
}
initializeDatabase();

// --- 🔐 SECURITY PROTOCOL ---
const ELITE_FIVE = [
  "jabojulesmaurice@gmail.com",
  "gasnamoses01@gmail.com",
  "uwingabireange2003@gmail.com",
  "uwajenezaernestine2002@gmail.com",
  "kayitareprecious057@gmail.com",
];
const MASTER_PASS = "jamupglobal@2026";

// --- 🏠 VISITOR FRONTEND ---
app.get("/", async (req, res) => {
  const currentYear = new Date().getFullYear();
  try {
    await pool.query("INSERT INTO visitor_logs (visitor_ip) VALUES ($1)", [
      req.ip,
    ]);
  } catch (e) {}

  res.send(`
    <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white; display:flex; flex-direction:column; min-height:100vh;">
      <nav style="display:flex; justify-content:space-between; padding:20px 50px; background:#1e293b; border-bottom:1px solid #334155;">
        <h2 style="color:#38bdf8; margin:0;">JAMUP GLOBAL</h2>
        <a href="/admin-gateway" style="background:#38bdf8; color:#0f172a; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold; font-size:12px;">ADMIN PORTAL</a>
      </nav>

      <main style="flex:1; text-align:center; padding:60px 20px;">
        <h1 style="font-size:48px;">Electronics <span style="color:#38bdf8;">Repairs</span></h1>
        <img src="https://unsplash.com" style="width:500px; border-radius:15px; border:5px solid #1e293b;" alt="Team">
        <br><br>
        <div style="background:#1e293b; padding:40px; border-radius:15px; display:inline-block; text-align:left; width:380px; border:1px solid #334155;">
          <h2 style="color:#38bdf8; margin-top:0;">Request Service</h2>
          <form action="/book" method="POST">
            <input name="name" placeholder="Full Name" required style="width:100%; padding:12px; margin-bottom:15px; background:#0f172a; color:white; border:1px solid #475569;">
            <input name="loc" placeholder="Location" required style="width:100%; padding:12px; margin-bottom:15px; background:#0f172a; color:white; border:1px solid #475569;">
            <textarea name="prob" placeholder="Details" required style="width:100%; padding:12px; margin-bottom:15px; background:#0f172a; color:white; border:1px solid #475569; height:80px;"></textarea>
            <button type="submit" style="width:100%; background:#38bdf8; padding:12px; border:none; font-weight:bold; cursor:pointer;">SUBMIT</button>
          </form>
        </div>
      </main>

      <footer style="background:#1e293b; padding:20px; text-align:center; border-top:1px solid #334155; color:#94a3b8; font-size:14px;">
        &copy; ${currentYear} JAMUP Global Hub. All rights reserved.
      </footer>
    </body>
  `);
});

// --- 🔐 ADMIN AUTH ---
app.get("/admin-gateway", (req, res) => {
  res.send(`
    <body style="background:#0f172a; color:white; text-align:center; padding-top:100px; font-family:sans-serif;">
      <h1>Admin Gateway</h1>
      <form action="/dashboard" method="POST" style="background:#1e293b; padding:40px; border-radius:10px; display:inline-block; border:1px solid #334155;">
        <input type="email" name="email" placeholder="Email" required style="padding:10px; width:250px; margin-bottom:15px;"><br>
        <input type="password" name="password" placeholder="Master Password" required style="padding:10px; width:250px; margin-bottom:15px;"><br>
        <button type="submit" style="background:#38bdf8; border:none; padding:10px 30px; font-weight:bold; cursor:pointer;">LOGIN</button>
      </form>
    </body>
  `);
});

app.post("/dashboard", async (req, res) => {
  const { email, password } = req.body;
  if (!ELITE_FIVE.includes(email) || password !== MASTER_PASS) {
    return res
      .status(403)
      .send("<h1>Access Denied</h1><a href='/admin-gateway'>Try Again</a>");
  }

  const clients = await pool.query("SELECT COUNT(*) as count FROM repairs");
  const visits = await pool.query("SELECT COUNT(*) as count FROM visitor_logs");
  const tasks = await pool.query(
    "SELECT * FROM repairs ORDER BY created_at DESC",
  );

  res.send(`
    <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white; padding:40px;">
      <h1>Master Dashboard</h1>
      <div style="display:flex; gap:20px; margin-bottom:30px;">
        <div style="background:#1e293b; padding:20px; border-radius:10px; flex:1;"><h3>Clients</h3><p style="font-size:32px;">\${clients.rows[0].count}</p></div>
        <div style="background:#1e293b; padding:20px; border-radius:10px; flex:1;"><h3>Traffic</h3><p style="font-size:32px;">\${visits.rows[0].count}</p></div>
      </div>
      <table style="width:100%; border-collapse:collapse; background:#1e293b; border-radius:10px; overflow:hidden;">
        <tr style="background:#334155; text-align:left;"><th style="padding:15px;">Client</th><th style="padding:15px;">Problem</th><th style="padding:15px;">Status</th></tr>
        \${tasks.rows.map(t => \`
          <tr style="border-bottom:1px solid #334155;">
            <td style="padding:15px;">\${t.customer_name}<br><small>\${t.location}</small></td>
            <td style="padding:15px;">\${t.problem_details}</td>
            <td style="padding:15px;">\${t.status}</td>
          </tr>
        \`).join('')}
      </table>
      <footer style="margin-top:40px; text-align:center; color:#94a3b8; font-size:12px;">
        &copy; ${new Date().getFullYear()} JAMUP Global Hub. All rights reserved.

      </footer>
    </body>
  `);
});

// --- 🚀 FUNCTIONAL ROUTES ---
app.post("/book", async (req, res) => {
  const { name, loc, prob } = req.body;
  await pool.query(
    "INSERT INTO repairs (customer_name, location, problem_details) VALUES ($1, $2, $3)",
    [name, loc, prob],
  );
  res.send("<h1>Request Received</h1><a href='/'>Go Back</a>");
});

app.listen(PORT, () => console.log(`🚀 Server operational on port ${PORT}`));
