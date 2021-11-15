const { json } = require("express");
const express = require("express");
const path = require("path");
const app = express();
var crypto = require("crypto");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const { users, schedules } = require("./data");

const PORT = process.env.PORT || 3000;

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'incode_project_3',
  password: 'root'
});

connection.connect(function (err) {
  if (err) {
    throw err
  } else {
    console.log('Connected')
  }

  app.get("/", (req, res) => {
    res.render("login");
  });

  app.get("/home", (req, res) => {
    res.render("main");
  });

  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    
  });

  app.get("/logout", (req, res) => {
    res.redirect("/login");
  });

  app.get("/signup", (req, res) => {
    res.render("signup");
  });

  app.post("/signup", (req, res) => {
    // if reg is valid, show a message and redirect to login
  });
  
  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
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

  app.get("/user", (req, res) => {
    let pageTitle = "All Users";
    let returnUser = users;
    res.render("users", { returnUser, pageTitle });
  });

  app.get("/schedules", (req, res) => {
    let pageTitle = "All Schedules";
    let returnedschedules = schedules;
    res.render("schedules", { returnedschedules, pageTitle });
  });

  app.get("/user/:userId", (req, res) => {
    let pageTitle;
    let userId = req.params.userId;

    if (userId >= users.length) {
      pageTitle = "User not found!";
      res.render("404", { pageTitle });
    } else {
      let returnUser = [users[userId]];
      console.log(returnUser);
      userFirstName = returnUser.values(users[userId])[0];
      userLastName = returnUser.values(users[userId])[1];
      pageTitle = "User Data of " + userFirstName + " " + userLastName;
      res.render("main", { layout: "users", returnUser, pageTitle });
    }
  });

  app.get("/user/:userId/schedules", (req, res) => {
    let userId = req.params.userId;

    if (userId >= users.length) {
      pageTitle = "User not found!";
      res.render("404", { pageTitle });
    } else {
      userFirstName = Object.values(users[userId])[0];
      userLastName = Object.values(users[userId])[1];

      let pageTitle = "Schedule of " + userFirstName + " " + userLastName;
      let returnedschedules;

      returnedschedules = schedules.filter((schedule) => {
        return schedule.user_id == userId;
      });
      res.render("main", {
        layout: "schedules",
        returnedschedules,
        pageTitle,
        users,
      });
    }
  });

  app.post("/users", (req, res) => {

    const newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    };

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
    users.push(newUser);
    res.json(users);
    console.log(users);
  });

  app.get("/users/new", (req, res) => {
    let pageTitle = "Create a new User"
    res.render("newUser", { pageTitle });
  })

  app.post("/users/new", (req, res) => {
    let pageTitle = "Create a new User"
    const firstname = req.body.firstName;
    const lastname = req.body.lastName;
    const { email } = req.body;
    const { password } = req.body;


    var hash = crypto
      .createHash("sha256")
      .update(req.body.password)
      .digest("base64");
    const newUser = {
      firstname,
      lastname,
      email,
      password
    }

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
    newUser.password = hash;
    users.push(newUser);
    res.redirect("/user");
  })


  app.post("/schedules", (req, res) => {
    const newSchedule = {
      user_id: req.body.userId,
      day: req.body.day,
      start_at: req.body.startAt,
      end_at: req.body.endAt,
    };
    if (
      !newSchedule.user_id ||
      !newSchedule.day ||
      !newSchedule.start_at ||
      !newSchedule.end_at
    ) {
      return res.status(400).json({ message: "All fields are requierd!" });
    }

    schedules.push(newSchedule);
    res.json(schedules);
    console.log(schedules);
  });


  app.get("/schedules/new", (req, res) => {
    let pageTitle = "Create a Schedule"

    res.render("newSchedule", { pageTitle, users });
  })



  app.post("/schedules/new", (req, res) => {

    let user_id;
    let fullNameConcated = req.body.name;

    const nameArr = fullNameConcated.split(',');
    console.log(nameArr);

    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      if (element.firstname === nameArr[0] && element.lastname === nameArr[1])
        user_id = index;
    }

    const newSchedule = {
      user_id,
      day: req.body.day,
      start_at: req.body.start_at,
      end_at: req.body.end_at,
    };
    if (
      !newSchedule.user_id ||
      !newSchedule.day ||
      !newSchedule.start_at ||
      !newSchedule.end_at
    ) {
      return res.status(400).json({ message: "All fields are requierd!" });
    }

    schedules.push(newSchedule);
    res.redirect("/schedules");

  });

});