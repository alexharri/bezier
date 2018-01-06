const getPoints = require("../points/getPoints");
const { getHandleById } = require("../handles/getHandles");

module.exports = function getConnectionPoints(c) {
  /**
   * We need to do it like this because of circular file requires.
   */
  const { getPointById } = getPoints;

  return [
    getPointById(c.points[0]),
    getHandleById(c.handles[0]),
    getHandleById(c.handles[1]),
    getPointById(c.points[1]),
  ];
}
