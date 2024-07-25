import express from 'express'
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from"cors"
import bodyParser from 'body-parser'
import menus from './routes/menus.js'
import players from './routes/players.js'
import users from './routes/users.js'

// Setup environment
dotenv.config()

const app = express()

app.use(cors())

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };
  
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', corsOptions.origin);
    res.header('Access-Control-Allow-Methods', corsOptions.methods);
    next();
  });
  


// Body-parser to parse incoming request bodies in a middleware before handlers.
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/images", express.static("images"));

app.get('/', (req, res) => {
  res.send('Hello to Morten API');
})

// Connect to routes
app.use('/api/menus', menus)
app.use('/api/players', players)
app.use('/api/users', users)

// Run app
const PORT = process.env.PORT || 4000;
const dbURL = process.env.MONGODB_URL;

// Connect to mongo database
mongoose.connect(dbURL,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message))

mongoose.set('useFindAndModify', false)