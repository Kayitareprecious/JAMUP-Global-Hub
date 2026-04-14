const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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

// 📊 Mid-ware to track visits
app.use(async (req, res, next) => {
  if (req.path === "/")
    await pool.query("INSERT INTO analytics (user_ip) VALUES ($1)", [req.ip]);
  next();
});

// --- 🏠 VISITOR FRONTEND ---
app.get("/", (req, res) => {
  res.send(`
    <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white;">
      <nav style="display:flex; justify-content:space-between; padding:20px 50px; background:#1e293b; border-bottom:1px solid #334155;">
        <h2 style="color:#38bdf8;">JAMUP HUB</h2>
        <a href="/login" style="background:#38bdf8; color:#0f172a; padding:10px 20px; border-radius:5px; text-decoration:none; font-weight:bold;">TEAM LOGIN</a>
      </nav>

      <div style="text-align:center; padding:60px;">
        <h1>Expert Electronics Repair in Musanze</h1>
        <p>Smartphones • Laptops • CCTV • Networking</p>
        <div style="display:flex; justify-content:center; gap:20px; margin:40px 0;">
             <img src="https://unsplash.com" style="width:250px; border-radius:10px;" alt="Laptops">
             <img src="https://unsplash.com" style="width:250px; border-radius:10px;" alt="Phones">
        </div>

        <div id="booking" style="background:#1e293b; padding:40px; border-radius:20px; display:inline-block; text-align:left; border:1px solid #334155;">
          <h2 style="color:#38bdf8;">Book a Repair</h2>
          <form action="/book-repair" method="POST">
            <input name="name" placeholder="Full Name" required style="width:100%; padding:10px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569;">
            <input name="location" placeholder="Your Location (e.g., Muhoza, Musanze)" required style="width:100%; padding:10px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569;">
            <select name="device" style="width:100%; padding:10px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569;">
                <option>Smartphone</option><option>Laptop/PC</option><option>CCTV/Security</option><option>Other</option>
            </select>
            <textarea name="problem" placeholder="Describe the problem..." required style="width:100%; padding:10px; margin:10px 0; background:#0f172a; color:white; border:1px solid #475569; height:80px;"></textarea>
            <button type="submit" style="width:100%; background:#38bdf8; padding:15px; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">SUBMIT REQUEST</button>
          </form>
        </div>
      </div>
    </body>
  `);
});

// --- 🔐 ADMIN LOGIN PAGE ---
app.get("/login", (req, res) => {
  res.send(`
    <body style="background:#0f172a; color:white; text-align:center; padding-top:100px; font-family:sans-serif;">
      <h1>Admin Gateway</h1>
      <form action="/dashboard" method="GET" style="background:#1e293b; padding:40px; border-radius:10px; display:inline-block;">
        <input type="email" name="email" placeholder="Authorized Email" required style="padding:10px; width:250px;"><br><br>
        <input type="password" placeholder="Generate Password" required style="padding:10px; width:250px;"><br><br>
        <button type="submit" style="background:#38bdf8; padding:10px 30px; border:none; font-weight:bold;">ENTER DASHBOARD</button>
      </form>
    </body>
  `);
});

// --- 📊 ADMIN DASHBOARD ---
app.get("/dashboard", async (req, res) => {
  const email = req.query.email;
  if (!ADMINS.includes(email))
    return res
      .status(403)
      .send(
        "<h1>Access Denied</h1><p>You do not have administrative access.</p>",
      );

  const stats = await pool.query("SELECT COUNT(*) as count FROM repairs");
  const visits = await pool.query("SELECT COUNT(*) as count FROM analytics");
  const tasks = await pool.query(
    "SELECT * FROM repairs ORDER BY created_at DESC",
  );

  let taskRows = tasks.rows
    .map(
      (t) => `
    <tr style="border-bottom:1px solid #334155;">
      <td style="padding:15px;">${t.customer_name}<br><small style="color:#94a3b8;">${t.location}</small></td>
      <td style="padding:15px;">${t.device_type}</td>
      <td style="padding:15px;">
        <form action="/update-task/${t.id}" method="POST">
          <input type="hidden" name="email" value="${email}">
          <select name="status" onchange="this.form.submit()" style="background:#0f172a; color:white; border:1px solid #475569; padding:5px;">
            <option ${t.status === "Pending" ? "selected" : ""}>Pending</option>
            <option ${t.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option ${t.status === "Completed" ? "selected" : ""}>Completed</option>
            <option ${t.status === "Denied" ? "selected" : ""}>Denied</option>
          </select>
        </form>
      </td>
      <td style="padding:15px;"><a href="/delete-task/${t.id}?email=${email}" style="color:#ef4444;">Delete</a></td>
    </tr>
  `,
    )
    .join("");

  res.send(`
    <body style="margin:0; font-family:sans-serif; background:#0f172a; color:white; padding:40px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h1>JAMUP Master Dashboard</h1>
        <img src="https://unsplash.com" style="width:100px; border-radius:50%; border:3px solid #38bdf8;" alt="Team">
      </div>

      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:20px; margin:30px 0;">
        <div style="background:#1e293b; padding:20px; border-radius:10px; border-left:5px solid #38bdf8;">
          <h3>Total Clients</h3><p style="font-size:32px; margin:0;">${stats.rows[0].count}</p>
        </div>
        <div style="background:#1e293b; padding:20px; border-radius:10px; border-left:5px solid #22c55e;">
          <h3>Website Visits</h3><p style="font-size:32px; margin:0;">${visits.rows[0].count}</p>
        </div>
        <div style="background:#1e293b; padding:20px; border-radius:10px; border-left:5px solid #f59e0b;">
          <h3>Live Revenue</h3><p style="font-size:32px; margin:0;">Calculating...</p>
        </div>
      </div>

      <table style="width:100%; border-collapse:collapse; background:#1e293b; border-radius:10px;">
        <tr style="background:#334155; text-align:left;">
          <th style="padding:15px;">Client & Location</th><th style="padding:15px;">Device</th><th style="padding:15px;">Status Control</th><th style="padding:15px;">Action</th>
        </tr>
        ${taskRows || '<tr><td colspan="4" style="padding:20px; text-align:center;">No repairs booked yet.</td></tr>'}
      </table>
    </body>
  `);
});

// --- 🚀 FORM ROUTES ---
app.post("/book-repair", async (req, res) => {
  const { name, location, device, problem } = req.body;
  await pool.query(
    "INSERT INTO repairs (customer_name, location, device_type, problem_details) VALUES ($1, $2, $3, $4)",
    [name, location, device, problem],
  );
  res.send(
    "<body style='background:#0f172a; color:white; text-align:center; padding:50px;'><h1>Request Sent!</h1><p>The JAMUP team will contact you shortly.</p><a href='/' style='color:#38bdf8;'>Back to Home</a></body>",
  );
});

app.post("/update-task/:id", async (req, res) => {
  const { status, email } = req.body;
  await pool.query("UPDATE repairs SET status = $1 WHERE id = $2", [
    status,
    req.params.id,
  ]);
  res.redirect(`/dashboard?email=${email}`);
});

app.listen(3000, () => console.log("🚀 JAMUP Global HUB Live!"));
