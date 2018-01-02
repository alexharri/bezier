const { getPointAtPosition } = require("../points/getPoints");
const { getConnectionAtPosition } = require("../connections/getConnections");
const getHandleAtPosition = require("../connections/getHandleAtPosition");

module.exports = function resolveObjectAtPosition(position) {
  /**
   * Returns the closest handle if it's close enough.
   */
  const handleAndPoint = getHandleAtPosition(position, true);
  if (handleAndPoint) {
    return {
      type: "__HANDLE",
      value: handleAndPoint,
    };
  }

  /**
   * Returns a point on a path if it's close enough.
   */
  const point = getPointAtPosition(position);
  if (point) {
    return {
      type: "__POINT",
      value: point,
    };
  }

  /**
   * Returns the closest point on the connection if a connection
   * is returned.
   */
  const connection = getConnectionAtPosition(position);
  if (connection) {
    return {
      type: "__CONNECTION",
      value: connection,
    }
  }

  return null;
}