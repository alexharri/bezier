const { combineReducers } = require("redux");

const history = require("./historyReducer");
const points = require("./pointReducer");
const selection = require("./selectionReducer");
const connections = require("./connectionReducer");

module.exports = combineReducers({
  history,
  points,
  selection,
  connections,
});
