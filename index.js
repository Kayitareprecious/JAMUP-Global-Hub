/**
 * @file index.js
 * @description Main Engine for JAMUP Eletrônica HUB.
 * Includes Admin Registration, Visitor Tracking, and Business Analytics.
 * @author JAMUP Technical Team
 */

const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));

// --- 🗄️ DATABASE CONNECTION ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/**
 * Robust Database Initialization.
 * Creates tables for Repairs (Clients) and Traffic (Analytics).
 */
async function initializeJAMUPDatabase() {
  try {
    const schema = `
      CREATE TABLE IF NOT EXISTS repairs (
        id SERIAL PRIMARY KEY,
        customer_name TEXT,
        customer_location TEXT,
        problem_details TEXT,
        status TEXT DEFAULT 'Pending',
        admin_assigned TEXT,
        cost INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS traffic_stats (
        id SERIAL PRIMARY KEY,
        visitor_ip TEXT,
        visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(schema);
    console.log("✅ JAMUP Global Database Structure Verified.");
  } catch (err) {
    console.error("❌ Database Error:", err.message);
  }
}
initializeJAMUPDatabase();

// --- 🔐 THE ELITE FIVE SECURITY ---
const ADMINS = [
  "jabojulesmaurice@gmail.com",
  "gasnamoses01@gmail.com",
  "uwingabireange2003@gmail.com",
  "uwajenezaernestine2002@gmail.com",
  "kayitareprecious057@gmail.com",
];

// --- 🏠 VISITOR FRONTEND (HOME) ---
app.get("/", async (req, res) => {
  // Track visitor traffic
  await pool.query("INSERT INTO traffic_stats (visitor_ip) VALUES ($1)", [
    req.ip,
  ]);

  res.send(`
    <body style="margin:0; font-family:'Segoe UI', sans-serif; background:#0f172a; color:white;">
      <nav style="display:flex; justify-content:space-between; padding:20px 50px; background:#1e293b; border-bottom:1px solid #334155;">
        <h2 style="color:#38bdf8;">JAMUP HUB</h2>
        <a href="/login" style="background:#38bdf8; color:#0f172a; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold; font-size:12px;">ADMIN PORTAL</a>
      </nav>

      <div style="text-align:center; padding:60px 20px;">
        <h1 style="font-size:48px;">Electronics Repair <span style="color:#38bdf8;">Experts</span></h1>
        <p style="font-size:18px; color:#94a3b8;">Phones • Laptops • CCTV • Industrial Instruments</p>

        <div style="display:flex; justify-content:center; gap:20px; margin:40px 0;">
             <img src="https://unsplash.com" style="width:500px; border-radius:15px; border:4px solid #1e293b;" alt="Team Working Together">
        </div>

        <div style="background:#1e293b; padding:40px; border-radius:20px; display:inline-block; text-align:left; border:1px solid #334155; width:400px;">
          <h2 style="color:#38bdf8;">Book a Repair</h2>
          <form action="/book" method="POST">
            <label>Full Name</label>
            <input name="name" required style="width:100%; padding:12px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:5px;">
            <label>Location (City/Neighborhood)</label>
            <input name="loc" required style="width:100%; padding:12px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569; border-radius:5px;">
            <label>Describe the Problem</label>
            <textarea name="prob" required style="width:100%; padding:12px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569; height:80px; border-radius:5px;"></textarea>
            <button type="submit" style="width:100%; background:#38bdf8; padding:15px; border:none; border-radius:5px; font-weight:bold; cursor:pointer; color:#0f172a;">SUBMIT REQUEST</button>
          </form>
        </div>
      </div>
    </body>
  `);
});

// --- 🔐 ADMIN REGISTRATION & LOGIN ---
app.get("/login", (req, res) => {
  res.send(`
    <body style="background:#0f172a; color:white; text-align:center; padding-top:100px; font-family:sans-serif;">
      <h1>Founder Registration</h1>
      <form action="/dashboard" method="GET" style="background:#1e293b; padding:40px; border-radius:10px; display:inline-block; width:300px;">
        <input type="email" name="email" placeholder="Founder Email" required style="width:100%; padding:12px; margin-bottom:15px;">
        <input type="password" placeholder="Generate Password" required style="width:100%; padding:12px; margin-bottom:15px;">
        <input type="password" placeholder="Confirm Password" required style="width:100%; padding:12px; margin-bottom:15px;">
        <button type="submit" style="width:100%; background:#38bdf8; padding:12px; border:none; font-weight:bold; cursor:pointer;">ENTER HUB</button>
      </form>
    </body>
  `);
});

// --- 📊 ADMIN DASHBOARD & DATA ANALYST ---
app.get("/dashboard", async (req, res) => {
  const email = req.query.email;

  // Access Control Gate
  if (!ADMINS.includes(email)) {
    return res
      .status(403)
      .send(
        "<body style='background:#0f172a; color:white; text-align:center; padding:100px;'><h1>Access Denied</h1><p>You do not have permission to view this database.</p><a href='/' style='color:#38bdf8;'>Back to Home</a></body>",
      );
  }

  try {
    const clients = await pool.query("SELECT COUNT(*) as count FROM repairs");
    const visits = await pool.query(
      "SELECT COUNT(*) as count FROM traffic_stats",
    );
    const logs = await pool.query(
      "SELECT * FROM repairs ORDER BY created_at DESC",
    );

    let rows = logs.rows
      .map(
        (row) => `
      <tr style="border-bottom:1px solid #334155;">
        <td style="padding:15px;">${row.customer_name}<br><small style="color:#94a3b8;">📍 ${row.customer_location}</small></td>
        <td style="padding:15px;">${row.problem_details}</td>
        <td style="padding:15px;">
          <form action="/update-status/${row.id}" method="POST" style="margin:0;">
            <input type="hidden" name="email" value="${email}">
            <select name="status" onchange="this.form.submit()" style="background:#0f172a; color:white; border:1px solid #475569; padding:5px; border-radius:5px;">
              <option ${row.status === "Pending" ? "selected" : ""}>Pending</option>
              <option ${row.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option ${row.status === "Completed" ? "selected" : ""}>Completed</option>
              <option ${row.status === "Denied" ? "selected" : ""}>Denied</option>
            </select>
          </form>
        </td>
        <td style="padding:15px;"><a href="/delete/${row.id}?email=${email}" style="color:#ef4444; text-decoration:none;">Delete</a></td>
      </tr>
    `,
      )
      .join("");

    res.send(`
      <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white; padding:40px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h1>JAMUP Global Analytics</h1>
          <div style="text-align:right;">
             <p style="margin:0;">Admin Active: <b>${email}</b></p>
          </div>
        </div>

        <div style="display:flex; gap:20px; margin:30px 0;">
          <div style="background:#1e293b; padding:20px; border-radius:15px; flex:1; border-left:5px solid #38bdf8;">
            <h3 style="color:#94a3b8; font-size:12px; text-transform:uppercase;">Total Clients</h3>
            <p style="font-size:32px; font-weight:bold; margin:10px 0;">${clients.rows[0].count}</p>
          </div>
          <div style="background:#1e293b; padding:20px; border-radius:15px; flex:1; border-left:5px solid #22c55e;">
            <h3 style="color:#94a3b8; font-size:12px; text-transform:uppercase;">Website Visits</h3>
            <p style="font-size:32px; font-weight:bold; margin:10px 0;">${visits.rows[0].count}</p>
          </div>
        </div>

        <h2>Recent Repair Database</h2>
        <table style="width:100%; border-collapse:collapse; background:#1e293b; border-radius:15px; overflow:hidden;">
          <tr style="background:#334155; text-align:left;">
            <th style="padding:15px;">Client & Location</th><th style="padding:15px;">Problem Details</th><th style="padding:15px;">Task Status</th><th style="padding:15px;">Actions</th>
          </tr>
          ${rows || '<tr><td colspan="4" style="padding:20px; text-align:center;">No repairs currently in database.</td></tr>'}
        </table>
      </body>
    `);
  } catch (err) {
    res.status(500).send("Database Error: " + err.message);
  }
});

// --- 🚀 BACKEND LOGIC ROUTES ---

app.post("/book", async (req, res) => {
  const { name, loc, prob } = req.body;
  await pool.query(
    "INSERT INTO repairs (customer_name, customer_location, problem_details) VALUES ($1, $2, $3)",
    [name, loc, prob],
  );
  res.send(
    "<body style='background:#0f172a; color:white; text-align:center; padding:100px;'><h1>Booking Successful!</h1><p>We tracked your request. A JAMUP expert will contact you.</p><a href='/' style='color:#38bdf8;'>Go Back</a></body>",
  );
});

app.post("/update-status/:id", async (req, res) => {
  const { status, email } = req.body;
  await pool.query("UPDATE repairs SET status = $1 WHERE id = $2", [
    status,
    req.params.id,
  ]);
  res.redirect(`/dashboard?email=${email}`);
});

app.get("/delete/:id", async (req, res) => {
  const { email } = req.query;
  if (ADMINS.includes(email)) {
    await pool.query("DELETE FROM repairs WHERE id = $1", [req.params.id]);
    res.redirect(`/dashboard?email=${email}`);
  } else {
    res.status(403).send("Unauthorized");
  }
});

app.listen(3000, () => console.log("🚀 JAMUP Global HUB Live!"));
