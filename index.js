const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const Users = require("./users/user-model");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("BY ORDER OF THE PEAKY BLINDERS");
});

server.post("/api/register", (req, res) => {
  const user = req.body;

  user.password = bcrypt.hashSync(user.password, 6);

  Users.add(user)
    .then(saved => {
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

function restricted(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res
            .status(401)
            .json({ message: "Intentionally obscure authN error" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Unexpected Error: ", err });
      });
  } else {
    res.status(400).json({ message: "Please provide username and password" });
  }
}

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n*** Listening on port ${port} ***\n`));
