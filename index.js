const { json } = require("express");
const express = require("express");
const path = require("path");
const app = express();
var crypto = require("crypto");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const PORT = process.env.PORT || 3000;

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'incode_project_4',
  password: 'root'
});

connection.connect(function (err) {
  if (err) {
    throw err
  } else {
    console.log('Connected')
  }
});

const handlebars = require("express-handlebars");
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
  })
);
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/home", (req, res) => {
  res.render("main");
});

app.post("/login", (req, res) => {
  if (!request.body.email || !request.body.password)
    response.send({ msg: "Email and Password are required", status: false });

  var email = request.body.login;
  var password = md5(request.body.password);

  var sql = "SELECT * FROM users WHERE email = '" + email + "' and  password = '" + password + "' ";
  console.log(sql);
  mysqlConnection.query(sql, function (err, results) {
    if (results.length) {
      response.send({ id: results[0].id_user, email: results[0].email, status: true,
      });
    } else {
      response.send({ msg: "Email dosn't exist", status: false });
    }
  });
});

app.get("/logout", (req, res) => {
  res.redirect("/login");
});

app.post("/signup", (req, res) => {
  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(newUser);
  if (
    !newUser.firstname ||
    !newUser.lastname ||
    !newUser.email ||
    !newUser.password
  ) {
    return res
      .status(400)
      .json({ message: "All fields are requierd for registration!" });
  }
  var hash = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("base64");
  newUser.password = hash;
  connection.query(
    `INSERT INTO users (first_name, last_name, email, password)  VALUES ('${newUser.firstname}','${newUser.lastname}','${newUser.email}','${newUser.password}');`,
    (err) => {
      if (err) throw err;
      console.log("Data received from Db:");
      console.log(newUser);
      res.redirect('/login');
    }
  );

});

app.get("/user", (req, res) => {
  let pageTitle = "All Users";
  connection.query(
    `SELECT * from users;`,
    (err, result) => {
      if (err) throw err;
      console.log("Data received from Db:");
      console.log(result);
      res.render("users", { returnUser: result, pageTitle });
    }
  );
});

app.get("/schedule", (req, res) => {
  let pageTitle = "All Schedules";
  connection.query(
    `SELECT * from schedules;`,
    (err, result) => {
      if (err) throw err;
      console.log("Data received from Db:");
      console.log(result);
      res.render("schedules", { returnedschedules: result, pageTitle });
    }
  );
});

app.get("/user/:userId", (req, res) => {
  let pageTitle = "Users";

  id_user = request.body.id_user;

  connection.query(
    `SELECT * from users where id_user = ${id_user};`,
    (err, result) => {
      if (err) throw err;
      console.log("Data received from Db:");
      console.log(result);
      res.render("users", { returnedschedules: result, pageTitle });
    }
  );
});

app.get("/user/:userId/schedules", (req, res) => {
  let pageTitle = "Schedules";

  id_user = request.body.id_user;

  connection.query(
    `SELECT * from schedules where id_user = ${id_user};`,
    (err, result) => {
      if (err) throw err;
      console.log("Data received from Db:");
      console.log(result);
      res.render("schedules", { returnedschedules: result, pageTitle });
    }
  );
});

app.post("/users/new", (req, res) => {

  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(newUser);
  if (
    !newUser.firstname ||
    !newUser.lastname ||
    !newUser.email ||
    !newUser.password
  ) {
    return res
      .status(400)
      .json({ message: "All fields are requierd for registration!" });
  }
  var hash = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("base64");
  newUser.password = hash;
  connection.query(
    `INSERT INTO users (first_name, last_name, email, password)  VALUES ('${newUser.firstname}','${newUser.lastname}','${newUser.email}','${newUser.password}');`,
    (err) => {
      if (err) throw err;
      console.log("Data received from Db:");
      console.log(newUser);
      res.redirect('/newUser');
    }
  );

});

app.post("/schedules/new", (req, res) => {

  const newSchedule = {
    user_id: req.body.user_id,
    day: req.body.day,
    start_at: req.body.start_at,
    end_at: req.body.end_at,
  };
  console.log(newSchedule);

  if (
    !newSchedule.user_id ||
    !newSchedule.day ||
    !newSchedule.start_at ||
    !newSchedule.end_at
  ) {
    return res.status(400).json({ message: "All fields are requierd!" });
  }
  connection.query(
    `INSERT INTO schedules (id_user, dayoftheWeek, start_time, end_time)  VALUES ('${newSchedule.id_user}','${newSchedule.dayoftheWeek}','${newSchedule.start_time}','${newSchedule.end_time}');`,
    (err) => {
      if (err) throw err;
      console.log("Data received from Db:");
      console.log(newSchedule);
      res.redirect('/schedules/new');
    }
  )

});