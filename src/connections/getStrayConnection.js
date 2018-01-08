const { getPointConnections } = require("../points/getPoints");

module.exports = function getStrayConnection(pointId) {
  const connections = getPointConnections(pointId);

  for (let i = 0; i < connections.length; i += 1) {
    if (connections[i].points[1] === null) {
      return connections[i];
    }
  }

  return null;
}
