const { _connections } = require("./getConnections");

module.exports = function deleteConnection(id) {
  delete _connections[id];
}
