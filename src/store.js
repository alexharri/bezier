const { createStore } = require("redux");

const reducers = require("./reducers/index");

module.exports = createStore(reducers);
