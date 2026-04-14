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

// --- 🏠 VISITOR HOME PAGE ---
app.get("/", (req, res) => {
  res.send(`
    <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white;">
      <nav style="display:flex; justify-content:space-between; padding:20px 50px; background:#1e293b; border-bottom:1px solid #334155;">
        <h2 style="color:#38bdf8;">JAMUP HUB</h2>
        <a href="/dashboard?email=kayitareprecious057@gmail.com" style="background:#38bdf8; color:#0f172a; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold; font-size:12px;">ADMIN LOGIN</a>
      </nav>
      <div style="text-align:center; padding:60px;">
        <h1 style="font-size:48px;">Expert Electronics Repairs</h1>
        <div style="display:flex; justify-content:center; gap:20px; margin:40px 0;">
             <img src="https://unsplash.com" style="width:250px; border-radius:10px;" alt="Laptop Repair">
             <img src="https://unsplash.com" style="width:250px; border-radius:10px;" alt="Phone Repair">
        </div>
        <form action="/book" method="POST" style="background:#1e293b; padding:30px; border-radius:15px; display:inline-block; text-align:left; width:350px; border:1px solid #334155;">
          <h3>Book a Repair</h3>
          Name: <input name="name" required style="width:100%; padding:10px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569;">
          Location: <input name="loc" required style="width:100%; padding:10px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569;">
          Problem: <textarea name="prob" required style="width:100%; padding:10px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569; height:80px;"></textarea>
          <button type="submit" style="width:100%; background:#38bdf8; padding:12px; border:none; border-radius:5px; font-weight:bold; cursor:pointer; color:#0f172a;">SUBMIT REQUEST</button>
        </form>
      </div>
    </body>
  `);
});

// --- 🔐 ADMIN DASHBOARD ---
app.get("/dashboard", async (req, res) => {
  const email = req.query.email;
  if (!ADMINS.includes(email))
    return res
      .status(403)
      .send("<h1>Access Denied</h1><p>Email not authorized.</p>");

  try {
    const stats = await pool.query("SELECT COUNT(*) as count FROM repairs");
    const jobs = await pool.query(
      "SELECT * FROM repairs ORDER BY created_at DESC",
    );

    let jobRows = jobs.rows
      .map(
        (j) => `
      <tr style="border-bottom:1px solid #334155;">
        <td style="padding:15px;">${j.customer_name}<br><small style="color:#94a3b8;">${j.location}</small></td>
        <td style="padding:15px;">${j.customer_request}</td>
        <td style="padding:15px;">
          <form action="/status/${j.id}" method="POST" style="margin:0;">
            <input type="hidden" name="email" value="${email}">
            <select name="status" onchange="this.form.submit()" style="background:#0f172a; color:white; border:1px solid #475569; padding:5px;">
              <option ${j.status === "Pending" ? "selected" : ""}>Pending</option>
              <option ${j.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option ${j.status === "Completed" ? "selected" : ""}>Completed</option>
            </select>
          </form>
        </td>
      </tr>`,
      )
      .join("");

    res.send(`
      <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white; padding:40px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h1>JAMUP Admin Dashboard</h1>
          <img src="https://unsplash.com" style="width:80px; border-radius:50%; border:2px solid #38bdf8;" alt="Team">
        </div>
        <div style="display:flex; gap:20px; margin:30px 0;">
          <div style="background:#1e293b; padding:20px; border-radius:10px; flex:1;"><h3>Total Clients</h3><p style="font-size:32px; font-weight:bold;">${stats.rows[0].count}</p></div>
          <div style="background:#1e293b; padding:20px; border-radius:10px; flex:1;"><h3>Admin Active</h3><p style="font-size:18px;">${email}</p></div>
        </div>
        <table style="width:100%; border-collapse:collapse; background:#1e293b; border-radius:10px; overflow:hidden;">
          <tr style="background:#334155; text-align:left;"><th style="padding:15px;">Client & Location</th><th style="padding:15px;">Request</th><th style="padding:15px;">Status</th></tr>
          ${jobRows || '<tr><td colspan="3" style="padding:20px; text-align:center;">No repairs yet.</td></tr>'}
        </table>
      </body>
    `);
  } catch (err) {
    res.send("Database Error: " + err.message);
  }
});

// --- 🚀 FORM SUBMISSIONS ---
app.post("/book", async (req, res) => {
  const { name, loc, prob } = req.body;
  await pool.query(
    "INSERT INTO repairs (customer_name, location, customer_request) VALUES ($1, $2, $3)",
    [name, loc, prob],
  );
  res.send(
    "<body style='background:#0f172a; color:white; text-align:center; padding:50px;'><h1>Request Received!</h1><a href='/' style='color:#38bdf8;'>Go Back</a></body>",
  );
});

app.post("/status/:id", async (req, res) => {
  const { status, email } = req.body;
  await pool.query("UPDATE repairs SET status = $1 WHERE id = $2", [
    status,
    req.params.id,
  ]);
  res.redirect(`/dashboard?email=${email}`);
});

app.listen(3000, () => console.log("🚀 JAMUP Hub Ready!"));
