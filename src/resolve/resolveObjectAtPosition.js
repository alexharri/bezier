const { getPointAtPosition } = require("../points/getPoints");
const { getConnectionAtPosition } = require("../connections/getConnections");

module.exports = function resolveObjectAtPosition(position) {
  /**
   * Returns a point on a path if it's close enough.
   */
  const point = getPointAtPosition(position);
  if (point) {
    return point;
  }

  /**
   * Returns the closest point on the connection if a connection
   * is returned.
   */
  const connection = getConnectionAtPosition(position);
  if (connection) {
    return connection;
  }

  return null;
}