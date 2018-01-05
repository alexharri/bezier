const { combineReducers } = require("redux");

const history = require("./historyReducer");
const points = require("./pointReducer");
const selection = require("./selectionReducer");

module.exports = combineReducers({
  history,
  points,
  selection,
});
