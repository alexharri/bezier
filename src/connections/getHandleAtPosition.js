const { getAllConnections } = require("./getConnections");
const calcDistanceBetweenPositions = require("../../utils/calcDistanceBetweenPositions");
const { getPointById } = require("../points/getPoints");

module.exports = function getHandleAtPosition(position, getPoint) {
  const connections = getAllConnections();
  let closestHandle;
  let pointId;
  let distanceOfHandle;

  for (let i = 0; i < connections.length; i += 1) {
    for (let j = 0; j < connections[i].handles.length; j += 1) {
      const distance = calcDistanceBetweenPositions(position, connections[i].handles[j]);
      if (!distanceOfHandle || distance < distanceOfHandle) {
        closestHandle = connections[i].handles[j];
        if (getPoint) {
          pointId = connections[i].points[j];
        }
        distanceOfHandle = distance;
      }
    }
  }

  if (distanceOfHandle < 225) { // 15px
    if (getPoint) {
      return {
        handle: closestHandle,
        point: getPointById(pointId), 
      };
    }

    return closestHandle;
  }

  return null;
}
