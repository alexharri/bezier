const { createStore, applyMiddleware } = require("redux");
const { createLogger } = require("redux-logger");

const reducers = require("./reducers/index");

let middleware;

if (true) {
  middleware = applyMiddleware(
    createLogger({ collapsed: true }),
  );
}

module.exports = createStore(reducers, middleware);
