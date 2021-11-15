const crypto = require("crypto");

// we store the tokens in-memory for simplicity's sake
// in production we'd make them persistent
const authTokens = {};

const generateAuthToken = () => {
  // todo
};

module.exports = {
  setAuthToken: (userId, res) => {
    // todo
  },

  unsetAuthToken: (req, res) => {
    // todo
  },

  getSessionUser: (req, res, next) => {
    // todo
  },

  requireAuth: (req, res, next) => {
    // todo
  },

  getHashedPassword: (hash) => {
    var hash = crypto
      .createHash("sha256")
      .update(req.body.password)
      .digest("base64");
    newUser.password = hash;
    users.push(newUser);
    res.json(users);
    console.log(users);
    return hash;
  },
};