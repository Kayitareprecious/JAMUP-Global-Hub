/**
 * @file index.js
 * @description JAMUP Global HUB - Professional Electronics Repair Platform
 * modeled after premium tech service sites.
 * Features: Admin Auth, Visitor Tracking, Location-based Booking, and Professional Footer.
 * @author JAMUP Technical Team
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

async function initializeHubDatabase() {
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
    console.log("✅ JAMUP Hub Database Online.");
  } catch (err) {
    console.error("❌ DB Failure:", err.message);
  }
}
initializeHubDatabase();

// --- 🔐 SECURITY PROTOCOL ---
const ELITE_FIVE = [
  "jabojulesmaurice@gmail.com",
  "gasnamoses01@gmail.com",
  "uwingabireange2003@gmail.com",
  "uwajenezaernestine2002@gmail.com",
  "kayitareprecious057@gmail.com",
];
const MASTER_PASS = "jamupglobal@2026";
const currentYear = new Date().getFullYear();

// --- 🏠 VISITOR FRONTEND (High-End Tech UI) ---
app.get("/", async (req, res) => {
  try {
    await pool.query("INSERT INTO visitor_logs (visitor_ip) VALUES ($1)", [
      req.ip,
    ]);
  } catch (e) {}

  res.send(`
    <body style="margin:0; font-family:'Segoe UI', sans-serif; background:#0f172a; color:white; display:flex; flex-direction:column; min-height:100vh;">
      <!-- Modern Navigation -->
      <nav style="display:flex; justify-content:space-between; align-items:center; padding:20px 50px; background:#1e293b; border-bottom:1px solid #334155;">
        <h2 style="color:#38bdf8; margin:0; letter-spacing:1px;">JAMUP <span style="color:white; font-weight:lighter;">GLOBAL HUB</span></h2>
        <a href="/admin-gateway" style="background:#38bdf8; color:#0f172a; padding:10px 22px; border-radius:5px; text-decoration:none; font-weight:bold; font-size:12px; transition: 0.3s;">ADMIN PORTAL</a>
      </nav>

      <!-- Hero Section -->
      <main style="flex:1; text-align:center; padding:60px 20px;">
        <h1 style="font-size:52px; margin-bottom:10px;">Precision <span style="color:#38bdf8;">Repairs</span> for Modern Tech.</h1>
        <p style="font-size:18px; color:#94a3b8; max-width:700px; margin:0 auto 40px auto;">Specializing in Smartphones, Laptops, Industrial Instruments, and CCTV Systems. Fast. Reliable. Professional.</p>

        <!-- Professional Tech Images -->
        <div style="display:flex; justify-content:center; gap:20px; flex-wrap:wrap; margin-bottom:50px;">
          <img src="https://unsplash.com" style="width:280px; height:200px; border-radius:12px; object-fit:cover; border:2px solid #1e293b;" alt="Phone Repair">
          <img src="https://unsplash.com" style="width:280px; height:200px; border-radius:12px; object-fit:cover; border:2px solid #38bdf8;" alt="Team Work">
          <img src="https://unsplash.com" style="width:280px; height:200px; border-radius:12px; object-fit:cover; border:2px solid #1e293b;" alt="Laptop Tech">
        </div>

        <!-- Booking Form Card -->
        <div style="background:#1e293b; padding:45px; border-radius:20px; display:inline-block; text-align:left; width:100%; max-width:400px; border:1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <h2 style="color:#38bdf8; margin-top:0;">Book a Service Request</h2>
          <form action="/book" method="POST">
            <label style="font-size:12px; color:#94a3b8; text-transform:uppercase;">Full Name</label>
            <input name="name" required style="width:100%; padding:12px; margin:8px 0 20px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:6px; box-sizing:border-box;">

            <label style="font-size:12px; color:#94a3b8; text-transform:uppercase;">Location (Neighborhood/Street)</label>
            <input name="loc" required style="width:100%; padding:12px; margin:8px 0 20px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:6px; box-sizing:border-box;">

            <label style="font-size:12px; color:#94a3b8; text-transform:uppercase;">Describe Device & Problem</label>
            <textarea name="prob" required style="width:100%; padding:12px; margin:8px 0 20px 0; background:#0f172a; color:white; border:1px solid #475569; height:100px; border-radius:6px; resize:none; box-sizing:border-box;"></textarea>

            <button type="submit" style="width:100%; background:#38bdf8; padding:15px; border:none; border-radius:6px; font-weight:bold; cursor:pointer; color:#0f172a; text-transform:uppercase; letter-spacing:1px;">Submit to JAMUP Hub</button>
          </form>
        </div>
      </main>

      <!-- Professional Footer -->
      <footer style="background:#1e293b; padding:30px; text-align:center; border-top:1px solid #334155; color:#94a3b8; font-size:14px;">
        &copy; ${currentYear} JAMUP Global Hub. All rights reserved. | 📍 Musanze, Rwanda
      </footer>
    </body>
  `);
});

// --- 🔐 ADMIN AUTH GATEWAY ---
app.get("/admin-gateway", (req, res) => {
  res.send(`
    <body style="background:#0f172a; color:white; text-align:center; padding-top:100px; font-family:sans-serif;">
      <h1 style="color:#38bdf8;">Admin Access Control</h1>
      <p style="color:#94a3b8;">Enter Authorized Credentials.</p>
      <form action="/dashboard" method="POST" style="background:#1e293b; padding:40px; border-radius:15px; display:inline-block; border:1px solid #334155; width:340px; text-align:left;">
        <label style="font-size:12px; color:#94a3b8;">Official Email</label>
        <input type="email" name="email" required style="width:100%; padding:12px; margin:10px 0 20px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:5px;">

        <label style="font-size:12px; color:#94a3b8;">Master Password</label>
        <input type="password" name="password" required style="width:100%; padding:12px; margin:10px 0 20px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:5px;">

        <button type="submit" style="width:100%; background:#38bdf8; padding:15px; border:none; font-weight:bold; cursor:pointer; color:#0f172a; border-radius:5px;">LOGIN TO HUB</button>
      </form>
    </body>
  `);
});

app.post("/dashboard", async (req, res) => {
  const { email, password } = req.body;
  if (!ELITE_FIVE.includes(email) || password !== MASTER_PASS) {
    return res
      .status(403)
      .send(
        "<body style='background:#0f172a; color:white; text-align:center; padding-top:100px;'><h1>403: ACCESS DENIED</h1><a href='/admin-gateway' style='color:#38bdf8;'>Go Back</a></body>",
      );
  }

  const clients = await pool.query("SELECT COUNT(*) as count FROM repairs");
  const visits = await pool.query("SELECT COUNT(*) as count FROM visitor_logs");
  const tasks = await pool.query(
    "SELECT * FROM repairs ORDER BY created_at DESC",
  );

  res.send(`
    <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white; padding:40px;">
      <h1 style="color:#38bdf8;">Master Business Analytics</h1>
      <div style="display:flex; gap:20px; margin-bottom:40px;">
        <div style="background:#1e293b; padding:25px; border-radius:15px; flex:1; border-left:5px solid #38bdf8; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
          <h3 style="color:#94a3b8; font-size:12px; text-transform:uppercase; margin-top:0;">Total Hub Clients</h3>
          <p style="font-size:42px; font-weight:bold; margin:10px 0;">\${clients.rows[0].count}</p>
        </div>
        <div style="background:#1e293b; padding:25px; border-radius:15px; flex:1; border-left:5px solid #22c55e; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
          <h3 style="color:#94a3b8; font-size:12px; text-transform:uppercase; margin-top:0;">Traffic Awareness</h3>
          <p style="font-size:42px; font-weight:bold; margin:10px 0;">\${visits.rows[0].count}</p>
        </div>
      </div>

      <h2>Live Service Database</h2>
      <table style="width:100%; border-collapse:collapse; background:#1e293b; border-radius:15px; overflow:hidden;">
        <tr style="background:#334155; text-align:left;">
          <th style="padding:15px;">Client Profile</th><th style="padding:15px;">Technical Problem</th><th style="padding:15px;">Current Status</th>
        </tr>
        \${tasks.rows.map(t => \`
          <tr style="border-bottom:1px solid #334155;">
            <td style="padding:15px;">\${t.customer_name}<br><small style="color:#38bdf8;">📍 \${t.location}</small></td>
            <td style="padding:15px;">\${t.problem_details}</td>
            <td style="padding:15px;">\${t.status}</td>
          </tr>
        \`).join('')}
      </table>
      <footer style="margin-top:50px; text-align:center; color:#94a3b8; font-size:12px;">
        &copy; \${new Date().getFullYear()} JAMUP Global Hub. All rights reserved.
      </footer>
    </body>
  `);
});

// --- 🚀 FUNCTIONAL CORE ROUTES ---
app.post("/book", async (req, res) => {
  const { name, loc, prob } = req.body;
  try {
    await pool.query(
      "INSERT INTO repairs (customer_name, location, problem_details) VALUES ($1, $2, $3)",
      [name, loc, prob],
    );
    res.send(
      "<body style='background:#0f172a; color:white; text-align:center; padding-top:100px;'><h1>Request Synchronized!</h1><p>The JAMUP team will contact you shortly.</p><a href='/' style='color:#38bdf8;'>Back to Site</a></body>",
    );
  } catch (err) {
    res.status(500).send("Database Fault.");
  }
});

app.listen(PORT, () => console.log(`🚀 JAMUP Hub Active on Port ${PORT}`));
