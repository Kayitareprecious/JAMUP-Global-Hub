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
const MASTER_PASS = "jamupglobal@2026";

// --- VISITOR PAGE ---
app.get("/", (req, res) => {
  res.send(`
    <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white; text-align:center; padding:50px;">
      <h1 style="color:#38bdf8;">JAMUP GLOBAL HUB</h1>
      <p>Expert Electronics Repair in Musanze</p>
      <a href="/login" style="background:#38bdf8; color:#0f172a; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold;">ADMIN LOGIN</a>
      <div style="margin-top:50px;"><img src="https://unsplash.com" style="width:500px; border-radius:15px; border:3px solid #1e293b;"></div>
    </body>
  `);
});

// --- ADMIN LOGIN ---
app.get("/login", (req, res) => {
  res.send(`
    <body style="background:#0f172a; color:white; text-align:center; padding-top:100px;">
      <h2>Elite Five Gateway</h2>
      <form action="/dashboard" method="POST" style="background:#1e293b; padding:40px; border-radius:10px; display:inline-block; border:1px solid #334155;">
        <input type="email" name="email" placeholder="Admin Email" required style="padding:10px; width:250px; margin-bottom:15px;"><br>
        <input type="password" name="password" placeholder="Master Password" required style="padding:10px; width:250px; margin-bottom:15px;"><br>
        <button type="submit" style="background:#38bdf8; border:none; padding:10px 30px; font-weight:bold; cursor:pointer; color:#0f172a;">ENTER HUB</button>
      </form>
    </body>
  `);
});

// --- ADMIN DASHBOARD ---
app.post("/dashboard", async (req, res) => {
  const { email, password } = req.body;
  if (!ADMINS.includes(email) || password !== MASTER_PASS) {
    return res
      .status(403)
      .send("<h1>Access Denied</h1><a href='/login'>Try Again</a>");
  }

  try {
    const clients = await pool.query("SELECT COUNT(*) as count FROM repairs");
    const revenue = await pool.query("SELECT SUM(cost) as total FROM repairs");
    const tasks = await pool.query(
      "SELECT * FROM repairs ORDER BY created_at DESC",
    );

    let rows = tasks.rows
      .map(
        (t) => `
      <tr style="border-bottom:1px solid #334155;">
        <td style="padding:15px;"><b>${t.customer_name}</b><br><small style="color:#38bdf8;">📍 ${t.location}</small></td>
        <td style="padding:15px;">${t.customer_request}</td>
        <td style="padding:15px; color:#22c55e; font-weight:bold;">$${t.cost || 0}</td>
        <td style="padding:15px;">
          <form action="/status/${t.id}" method="POST" style="margin:0;">
            <input type="hidden" name="email" value="${email}">
            <select name="status" onchange="this.form.submit()" style="background:#0f172a; color:white; border:1px solid #475569; padding:5px; border-radius:5px;">
              <option ${t.status === "Pending" ? "selected" : ""}>Pending</option>
              <option ${t.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option ${t.status === "Completed" ? "selected" : ""}>Completed</option>
            </select>
          </form>
        </td>
      </tr>`,
      )
      .join("");

    res.send(`
      <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white; padding:40px;">
        <h1 style="color:#38bdf8;">Master Business Analytics</h1>
        <div style="display:flex; gap:20px; margin-bottom:40px;">
          <div style="background:#1e293b; padding:25px; border-radius:15px; flex:1; border-left:5px solid #38bdf8;">
            <h3 style="color:#94a3b8; font-size:12px; text-transform:uppercase; margin:0;">Total Clients</h3>
            <p style="font-size:42px; font-weight:bold; margin:10px 0;">${clients.rows.count}</p>
          </div>
          <div style="background:#1e293b; padding:25px; border-radius:15px; flex:1; border-left:5px solid #22c55e;">
            <h3 style="color:#94a3b8; font-size:12px; text-transform:uppercase; margin:0;">Total Revenue</h3>
            <p style="font-size:42px; font-weight:bold; margin:10px 0; color:#22c55e;">$${revenue.rows.total || 0}</p>
          </div>
        </div>
        <table style="width:100%; border-collapse:collapse; background:#1e293b; border-radius:15px; overflow:hidden;">
          <tr style="background:#334155; text-align:left;"><th style="padding:15px;">Client</th><th style="padding:15px;">Task</th><th style="padding:15px;">Cost</th><th style="padding:15px;">Status</th></tr>
          ${rows}
        </table>
        <footer style="margin-top:50px; text-align:center; color:#94a3b8; font-size:12px;">
          &copy; ${new Date().getFullYear()} JAMUP Global Hub. All rights reserved.
        </footer>
      </body>
    `);
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

app.post("/status/:id", async (req, res) => {
  const { status, email } = req.body;
  await pool.query("UPDATE repairs SET status = $1 WHERE id = $2", [
    status,
    req.params.id,
  ]);
  res.send(
    "<body style='background:#0f172a; color:white; text-align:center; padding-top:100px;'><h1>Status Updated!</h1><a href='/' style='color:#38bdf8;'>Back Home</a></body>",
  );
});

app.listen(3000, () => console.log("🚀 JAMUP Hub Ready!"));
