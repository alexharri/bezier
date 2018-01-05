const getClosestPointOnConnection = require("./getClosestPointOnConnection");
const { toConnectionId } = require("./connectionId");
const store = require("../store");

const a = "a";
const b = "b";

exports.getConnectionById = function getConnectionById(a, b) {
  return store.getState().connections[toConnectionId(a, b)] || null;
}

function getAllConnections() {
  const connections = store.getState().connections;
  
  const cArr = [];
  const keys = Object.keys(connections);
  for (let i = 0; i < keys.length; i += 1) {
    cArr.push(connections[keys[i]]);
  }
  return cArr;
}
exports.getAllConnections = getAllConnections;

exports.getConnectionAtPosition = function getConnectionAtPosition(position) {
  const connections = getAllConnections();

  for (let i = 0; i < connections.length; i += 1) {
    const closestPoint = getClosestPointOnConnection(connections[i], position);
    if (closestPoint) {
      return {
        closestPoint,
        connection: connections[i],
      };
    }
  }
  return null;
}