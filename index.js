// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import menus from "./routes/menus.js";
import players from "./routes/players.js";
import users from "./routes/users.js";

// Setup environment
dotenv.config();

const app = express();

app.enable("trust proxy", "127.0.0.1");
// Skapa en rate limiter med en gräns på 100 förfrågningar per 15 minuter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuter
  max: 100, // max antal förfrågningar per IP
  keyGenerator: (req, res) => {
    return req.ip; // Använd klientens IP-adress som nyckel
  },
});

// Applicera rate limiter på alla API-rutter
app.use("/api/", limiter);
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// Body-parser to parse incoming request bodies in a middleware before handlers.
app.use(bodyParser.json({ extended: true, limit: "200mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "200mb",
    parameterLimit: 50000,
  })
);

app.get("/", (req, res) => {
  res.send("Hello to Morten API");
});

// Connect to routes
app.use("/api/menus", menus);
app.use("/api/players", players);
app.use("/api/users", users);

// Run app
const PORT = process.env.PORT || 4000; // Set default port to 4000

const dbURL = process.env.MONGODB_URL;

// Connect to mongo database
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit with failure code
  });

process.on("uncaughtException", (err) => {
  console.error("Unhandled Exception:", err.message);
  process.exit(1); // Exit with failure code
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1); // Exit with failure code
});

mongoose.set("useFindAndModify", false);
