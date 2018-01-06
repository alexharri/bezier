const { types } = require("../constants");

const { POINT, CONN, HANDLE } = types;

const resolvers = {
  [POINT]:  x => x.id,
  [HANDLE]: x => x.id,
  [CONN]:   x => x.connection.id,
};

console.log(resolvers);

/**
 * Returns the ids of object fetched through the
 * resolveObjectAtPosition function.
 */
module.exports = function resolveObjectId(type, value) {
  if (typeof resolvers[type] !== "function") {
    throw new Error(`Invalid type: '${type}'.`);
  }

  return resolvers[type](value);
}
