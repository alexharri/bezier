const getPoints = require("../points/getPoints");
const { getHandleById } = require("../handles/getHandles");

module.exports = function getConnectionPoints(c) {
  /**
   * We need to do it like this because of circular file requires.
   */
  const { getPointById } = getPoints;

  const [ p0, p3 ] = c.points;
  const [ p1, p2 ] = c.handles;

  if (!p1 && !p2 && !p3) {
    throw new Error("Invalid connection.");
  }

  /**
   * The p1 handle should always be present when the connection is created.
   *
   * However, handles may be deleted after the connection is created, so
   * there's a possibility that the connection has two points but no handles.
   */
  return [
    getPointById(p0),
    p1 ? getHandleById(p1) : null,
    p2 ? getHandleById(p2) : null,
    p3 ? getPointById(p3) : null,
  ];
}
