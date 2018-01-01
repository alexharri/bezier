const { toConnectionId } = require("./connectionId");
const getClosestPointOnConnection = require("./getClosestPointOnConnection");

const a = "a";
const b = "b";

const connections = {
  [toConnectionId(a, b)]: {
    id: toConnectionId(a, b),
    points: [a, b],
    handles: [
      { x: 240, y: 20 },
      { x: 360, y: 500 },
    ],
  },
};
exports._connections = connections;

exports.getConnectionById = function getConnectionById(a, b) {
  return connections[toConnectionId(a, b)] || null;
}

exports.getAllConnections = function getAllConnections() {
  const cArr = [];
  const keys = Object.keys(connections);
  for (let i = 0; i < keys.length; i += 1) {
    cArr.push(connections[keys[i]]);
  }
  return cArr;
}

exports.getConnectionAtPosition = function getConnectionAtPosition(position) {
  const keys = Object.keys(connections);
  for (let i = 0; i < keys.length; i += 1) {
    const closestPoint = getClosestPointOnConnection(connections[keys[i]], position)
    if (closestPoint) { // 20px
      return {
        type: "__CONNECTION",
        value: {
          closestPoint,
          connection: connections[keys[i]],
        },
      };
    }
  }
  return null;
}