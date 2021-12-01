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

//ROUTES ------------------------------------------

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (request, response) => {
  response.render("signup");
});


app.get("/users/new", (request, response) => {
  response.render("newuser");
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});

app.get("/schedules/new", (request, response) => {
  response.render("newSchedule");
});


//LOGIN ----------------------------------------
app.post("/", (request, response) => {
  if (!request.body.email || !request.body.password)
    response.send({ msg: "Email and Password are required"});

  var email = request.body.email;
  var password = crypto
  .createHash("sha256")
  .update(request.body.password)
  .digest("base64");

  console.log(request.body);

  var sql = "SELECT * FROM users WHERE email = '" + email + "' and  password = '" + password + "' ";
  console.log(sql);
  connection.query(sql, function (err, result) {
    if (result) {
      response.redirect("/user");
    } else {
      response.send({ msg: "Email or password dosen't match", status: false });
    }
  });

});

//SIGNUP ----------------------------------------
app.post("/signup", (req, res) => {
  
  const newUser = {
    firstName: req.body.firstName,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(newUser);
  if (
    !newUser.firstName ||
    !newUser.userName ||
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
    `INSERT INTO users (first_name, last_name, email, password)  VALUES ('${newUser.firstName}','${newUser.userName}','${newUser.email}','${newUser.password}');`,
    (err) => {
      if (err) throw err;
      console.log("Data received from Db:");
      console.log(newUser);
      res.redirect('/');
    }
  );

});

//GET ALL USERS ----------------------------------------
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

//GET ALL SCHEDULES ----------------------------------------
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

// app.get("/user/:userId", (req, res) => {
//   let pageTitle = "Users";

//   id_user = request.body.id_user;

//   connection.query(
//     `SELECT * from users where id_user = ${id_user};`,
//     (err, result) => {
//       if (err) throw err;
//       console.log("Data received from Db:");
//       console.log(result);
//       res.render("users", { returnedschedules: result, pageTitle });
//     }
//   );
// });

// app.get("/user/:userId/schedules", (req, res) => {
//   let pageTitle = "Schedules";

//   id_user = request.body.id_user;

//   connection.query(
//     `SELECT * from schedules where id_user = ${id_user};`,
//     (err, result) => {
//       if (err) throw err;
//       console.log("Data received from Db:");
//       console.log(result);
//       res.render("schedules", { returnedschedules: result, pageTitle });
//     }
//   );
// });

//ADD NEW USER ----------------------------------------
app.post("/users/new", (req, res) => {

  const UserNew = {
    firstName: req.body.firstName,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(UserNew);
  if (
    !UserNew.firstName ||
    !UserNew.userName ||
    !UserNew.email ||
    !UserNew.password
  ) {
    return res
      .status(400)
      .json({ message: "All fields are requierd for registration!" });
  }
  var hash = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("base64");
    UserNew.password = hash;
  connection.query(
    `INSERT INTO users (first_name, last_name, email, password)  VALUES ('${UserNew.firstName}','${UserNew.userName}','${UserNew.email}','${UserNew.password}');`,
    (err) => {
      if (err) throw err;
      console.log("Data received from Db:");
      console.log(UserNew);
      res.redirect('/user');
    }
  );

});

app.post("/schedules/new", (req, res) => {

  const newSchedule = {
    id_user: req.body.id_user,
    dayoftheweek: req.body.dayoftheweek,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
  };
  console.log(newSchedule);
  if (
    !newSchedule.id_user ||
    !newSchedule.dayoftheweek ||
    !newSchedule.start_time ||
    !newSchedule.end_time
  ) {
    return res
      .status(400)
      .json({ message: "All fields are requierd for registration!" });
  }
    connection.query(
    `INSERT INTO schedules (id_user, dayoftheweek, start_time, end_time)  VALUES ('${newSchedule.id_user}','${newSchedule.dayoftheweek}','${newSchedule.start_time}','${newSchedule.end_time}');`,
    (err) => {
      if (err) throw err;
      console.log("Data received from Db:");
      console.log(newSchedule);
      res.redirect('/schedule');
    }
  );

});

app.listen(PORT, ()=>{console.log("listen on PORT", PORT)});
