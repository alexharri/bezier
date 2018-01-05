const { combineReducers } = require("redux");

const history = require("./historyReducer");
const points = require("./pointReducer");

module.exports = combineReducers({
  history,
  points,
});
