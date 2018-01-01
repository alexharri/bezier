const { toConnectionId } = require("./connectionId");
const { _connections } = require("./getConnections");

module.exports = function addConnection(p0Id, p1, p2, p3Id) {
  const id = toConnectionId(p0Id, p3Id);
  _connections[id] = {
    id,
    points: [p0Id, p3Id],
    handles: [
      p1,
      p2,
    ],
  };
}
