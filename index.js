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
app.get("/", (req, res) => {
  res.send(`
    <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white; text-align:center; padding:50px;">
      <h1 style="color:#38bdf8;">JAMUP Eletrônica HUB</h1>
      <p style="font-size:18px;">Expert Repairs for your Electronics. Send a request below!</p>
      <form action="/request" method="POST" style="background:#1e293b; padding:30px; border-radius:15px; display:inline-block; text-align:left; border:1px solid #334155; width:350px;">
        Name: <br><input name="name" required style="width:100%; padding:10px; margin:10px 0; border-radius:5px; background:#0f172a; color:white; border:1px solid #475569;"><br>
        Problem & Device: <br><textarea name="request" required style="width:100%; padding:10px; margin:10px 0; border-radius:5px; background:#0f172a; color:white; border:1px solid #475569; height:80px;"></textarea><br>
        <button type="submit" style="width:100%; background:#38bdf8; padding:12px; border:none; border-radius:5px; font-weight:bold; cursor:pointer; color:#0f172a;">Send Request</button>
      </form>
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
