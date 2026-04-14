// --- DATABASE AUTO-FIX ---
// This code ensures the 'repairs' table exists every time the app starts
pool
  .query(
    `
  CREATE TABLE IF NOT EXISTS repairs (
    id SERIAL PRIMARY KEY, 
    device TEXT, 
    cost INT, 
    customer_name TEXT, 
    customer_request TEXT, 
    status TEXT DEFAULT 'Pending', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`,
  )
  .then(() => console.log("✅ Database Table Verified and Ready"))
  .catch((err) => console.error("❌ Table Creation Error:", err.message));
// -------------------------

const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const ADMINS = [
  "jabojulesmaurice@gmail.com",
  "gasnamoses01@gmail.com",
  "uwingabireange2003@gmail.com",
  "uwajenezaernestine2002@gmail.com",
  "kayitareprecious057@gmail.com",
];

// --- VISITOR PAGE (HOME) ---
// --- VISITOR PAGE (HOME) ---
app.get("/", (req, res) => {
  res.send(`
    <body style="margin:0; font-family:'Segoe UI', sans-serif; background:#0f172a; color:white;">
      <!-- Modern Navigation Bar -->
      <nav style="display:flex; justify-content:space-between; align-items:center; padding:15px 50px; background:#1e293b; border-bottom:1px solid #334155;">
        <h2 style="margin:0; color:#38bdf8; font-weight:bold;">JAMUP <span style="color:white; font-weight:300;">HUB</span></h2>
        <div style="display:flex; gap:20px; align-items:center;">
          <a href="mailto:jamupglobal@gmail.com" style="color:#94a3b8; text-decoration:none; font-size:14px; font-weight:bold;">CONTACT US</a>
          <!-- The Admin Portal Button -->
          <a href="/dashboard?email=kayitareprecious057@gmail.com" style="background:#38bdf8; color:#0f172a; padding:8px 20px; border-radius:5px; text-decoration:none; font-weight:bold; font-size:13px;">ADMIN LOGIN</a>
        </div>
      </nav>

      <!-- Main Section -->
      <div style="text-align:center; padding:80px 20px;">
        <h1 style="font-size:48px; margin-bottom:10px; font-weight:800;">Expert Electronics <span style="color:#38bdf8;">Repairs.</span></h1>
        <p style="font-size:18px; color:#94a3b8; max-width:600px; margin:auto; margin-bottom:40px;">Request professional service for your devices. Fast, reliable, and secure.</p>

        <form action="/request" method="POST" style="background:#1e293b; padding:30px; border-radius:15px; display:inline-block; text-align:left; border:1px solid #334155; width:360px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
          <label style="font-size:12px; color:#94a3b8; text-transform:uppercase; font-weight:bold;">Your Full Name</label>
          <input name="name" required style="width:100%; padding:12px; margin:8px 0 20px 0; border-radius:5px; background:#0f172a; color:white; border:1px solid #475569; box-sizing: border-box;">

          <label style="font-size:12px; color:#94a3b8; text-transform:uppercase; font-weight:bold;">Device & Problem Details</label>
          <textarea name="request" required style="width:100%; padding:12px; margin:8px 0 20px 0; border-radius:5px; background:#0f172a; color:white; border:1px solid #475569; height:100px; box-sizing: border-box;"></textarea>

          <button type="submit" style="width:100%; background:#38bdf8; padding:12px; border:none; border-radius:5px; font-weight:bold; cursor:pointer; color:#0f172a; text-transform:uppercase; letter-spacing:1px;">Send Repair Request</button>
        </form>
      </div>
    </body>
  `);
});

// --- VISITOR SUBMISSION ---
app.post("/request", async (req, res) => {
  const { name, request } = req.body;
  await pool.query(
    "INSERT INTO repairs (customer_name, customer_request, status) VALUES ($1, $2, $3)",
    [name, request, "New Request"],
  );
  res.send(
    '<body style="background:#0f172a; color:white; text-align:center; padding:50px;"><h1>Request Received!</h1><p>We will contact you soon. <a href="/" style="color:#38bdf8;">Go Back</a></p></body>',
  );
});

// --- ADMIN DASHBOARD ---
app.get("/dashboard", async (req, res) => {
  const email = req.query.email;
  if (ADMINS.includes(email)) {
    try {
      const stats = await pool.query(
        "SELECT COUNT(*) as total, SUM(cost) as revenue FROM repairs",
      );
      const history = await pool.query(
        "SELECT * FROM repairs ORDER BY created_at DESC",
      );

      let rows = history.rows
        .map(
          (r) => `
        <tr style="border-bottom:1px solid #334155;">
          <td style="padding:12px;">${r.customer_name || "Admin"}</td>
          <td style="padding:12px;">${r.customer_request || r.device}</td>
          <td style="padding:12px; color:#22c55e;">$${r.cost || 0}</td>
          <td style="padding:12px;">${r.status}</td>
          <td style="padding:12px;"><a href="/delete/${r.id}?email=${email}" style="color:#ef4444; text-decoration:none; font-size:12px;">Delete</a></td>
        </tr>`,
        )
        .join("");

      res.send(`
        <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white; padding:40px;">
          <h1 style="color:#38bdf8;">JAMUP HUB Admin</h1>
          <div style="display:flex; gap:20px; margin-bottom:30px;">
            <div style="background:#1e293b; padding:20px; border-radius:10px; flex:1;"><h3>Total Units</h3><p style="font-size:32px; margin:0;">${stats.rows.total}</p></div>
            <div style="background:#1e293b; padding:20px; border-radius:10px; flex:1;"><h3>Revenue</h3><p style="font-size:32px; margin:0; color:#22c55e;">$${stats.rows.revenue || 0}</p></div>
          </div>
          <h2>Recent Activity</h2>
          <table style="width:100%; border-collapse:collapse; background:#1e293b; border-radius:10px;">
            <tr style="background:#334155; text-align:left;"><th style="padding:12px;">Client</th><th style="padding:12px;">Job</th><th style="padding:12px;">Cost</th><th style="padding:12px;">Status</th><th style="padding:12px;">Action</th></tr>
            ${rows || '<tr><td colspan="5" style="padding:20px; text-align:center;">No activity found</td></tr>'}
          </table>
        </body>
      `);
    } catch (err) {
      res.send("Database Error: " + err.message);
    }
  } else {
    res.status(403).send("Access Denied");
  }
});

// --- DELETE ROUTE ---
app.get("/delete/:id", async (req, res) => {
  const email = req.query.email;
  if (ADMINS.includes(email)) {
    await pool.query("DELETE FROM repairs WHERE id = $1", [req.params.id]);
    res.redirect(`/dashboard?email=${email}`);
  } else {
    res.status(403).send("Unauthorized");
  }
});

app.listen(3000, () => console.log("🚀 JAMUP Hub Ready!"));
