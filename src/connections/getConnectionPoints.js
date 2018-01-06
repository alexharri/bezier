const x = require("../points/getPoints");
const { getHandleById } = require("../handles/getHandles");

module.exports = function getConnectionPoints(c) {
  const { getPointById } = x;
  return [
    getPointById(c.points[0]),
    getHandleById(c.handles[0]),
    getHandleById(c.handles[1]),
    getPointById(c.points[1]),
  ];
}
