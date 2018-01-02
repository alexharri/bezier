const { getAllConnections } = require("../connections/getConnections");

module.exports = function getPointConnectionHandles(pointId) {
  const handles = [];
  const connections = getAllConnections();
  
  for (let i = 0; i < connections.length; i += 1) {
    const pointIndex = connections[i].points.indexOf(pointId);
    if (pointIndex > -1) {
      handles.push(connections[i].handles[pointIndex]);
    }
  }

  return handles;
}
