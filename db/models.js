const { setAuthToken, getHashedPassword } = require("../routes/auth");

module.exports.User = {
  // function 1: call to db to get user info by passing their id
  // function 2: auth the user (for login)
  // function 3: validate a new sign-up
};

module.exports.Schedule = {
  // function 1: get all schedules
  // function 2: get all schedules for logged in user
  // function 3: create new schedule entry
};
