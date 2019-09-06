const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require('express-session')
const connectSessionKnex = require('connect-session-knex')

const Users = require("./users/user-model");
const db = require('./data/db-config')

const server = express();
const KnexSessionStore = connectSessionKnex(session)

const sessionConfig = {
  name: "notsession", // default is connect.sid
  // This should not be hardcoded. This should be in an env variable
  secret: "monsoon demons stole my teacher",
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
    secure: false // set to TRUE in production -- only set cookies over https. Server will not send back a cookie over http.
  }, 
  httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false,
  // Where do we store our sessions? defaults to server
  store: new KnexSessionStore({
    knex: db,
    tablename: 'sessions',
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60 * 24 * 1
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig))

server.get("/", (req, res) => {
  res.send("BY ORDER OF THE PEAKY BLINDERS");
});

server.post("/api/register", (req, res) => {
  const user = req.body;

  user.password = bcrypt.hashSync(user.password, 6);

  Users.add(user)
    .then(saved => {
      req.session.user = saved.username;
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json({ message: "Error adding user: ", err });
    });
});

server.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user.username
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error logging in: ", err });
    });
});

server.get("/api/users", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get('/api/logout', restricted, (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json({message: "Failed to logout: ", err})
      } else {
        res.json({message: "Goodbye"})
      }
    })
  }
})

function restricted(req, res, next) {
  if (req.session && req.session.user) {
    next()
  } else {
    res.status(400).json({message: "Invalid credentials"})
  }
}

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n*** Listening on port ${port} ***\n`));
