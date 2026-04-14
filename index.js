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

// --- DASHBOARD ROUTE ---
app.get("/dashboard", async (req, res) => {
  const email = req.query.email;
  if (ADMINS.includes(email)) {
    try {
      const stats = await pool.query(
        "SELECT COUNT(*) as total, SUM(cost) as revenue FROM repairs",
      );
      res.send(`
        <body style="margin:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: white;">
          <div style="max-width: 1000px; margin: auto; padding: 40px;">
            <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 1px solid #1e293b; padding-bottom: 20px;">
              <h1 style="margin:0; color: #38bdf8;">JAMUP <span style="color:white; font-weight:300;">Eletrônica HUB</span></h1>
              <span style="background: #1e293b; padding: 8px 15px; border-radius: 20px; font-size: 14px;">Admin: ${email}</span>
            </header>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px;">
              <div style="background: #1e293b; padding: 30px; border-radius: 15px; border: 1px solid #334155;">
                <h3 style="margin:0; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Total Repair Units</h3>
                <p style="font-size: 48px; margin: 10px 0 0 0; font-weight: bold;">${stats.rows.total}</p>
              </div>
              <div style="background: #1e293b; padding: 30px; border-radius: 15px; border: 1px solid #334155;">
                <h3 style="margin:0; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Total Revenue</h3>
                <p style="font-size: 48px; margin: 10px 0 0 0; font-weight: bold; color: #22c55e;">$${stats.rows.revenue || 0}</p>
              </div>
            </div>
            <div style="background: #1e293b; padding: 30px; border-radius: 15px; border: 1px solid #334155;">
              <h2 style="margin-top:0;">Register New Service</h2>
              <form action="/add" method="POST" style="display: flex; gap: 15px;">
                <input name="device" placeholder="Device Description" required style="flex: 2; padding: 12px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: white;">
                <input name="cost" type="number" placeholder="Cost ($)" required style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: white;">
                <input type="hidden" name="email" value="${email}">
                <button type="submit" style="background: #38bdf8; color: #0f172a; border: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; cursor: pointer;">Save Record</button>
              </form>
            </div>
          </div>
        </body>
      `);
    } catch (err) {
      res.status(500).send("Database Error: " + err.message);
    }
  } else {
    res.status(403).send("Access Denied");
  }
});

app.post("/add", async (req, res) => {
  const { device, cost, email } = req.body;
  await pool.query("INSERT INTO repairs (device, cost) VALUES ($1, $2)", [
    device,
    cost,
  ]);
  res.redirect(`/dashboard?email=${email}`);
});

app.get("/", (req, res) =>
  res.send("<h1>JAMUP HUB</h1><p>Admin Login Required</p>"),
);

app.listen(3000, () => console.log("🚀 JAMUP Hub is Live!"));
