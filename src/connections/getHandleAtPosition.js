const { getAllConnections } = require("./getConnections");
const calcDistanceBetweenPositions = require("../../utils/calcDistanceBetweenPositions");

module.exports = function getHandleAtPosition(position) {
  const connections = getAllConnections();
  let closestHandle;
  let distanceOfHandle;

  for (let i = 0; i < connections.length; i += 1) {
    for (let j = 0; j < connections[i].handles.length; j += 1) {
      const distance = calcDistanceBetweenPositions(position, connections[i].handles[j]);
      if (!distanceOfHandle || distance < distanceOfHandle) {
        closestHandle = connections[i].handles[j];
        distanceOfHandle = distance;
      }
    }
  }

  if (distanceOfHandle < 225) { // 15px
    return closestHandle;
  }

  return null;
}
