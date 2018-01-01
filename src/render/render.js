const getContext = require("../canvas/getContext");
const renderConnections = require("./connections/renderConnections");
const renderPoints = require("./points/renderPoints");

const ctxHeight = 800;
const ctxWidth = 800;

module.exports = function render() {
  const ctx = getContext();
  ctx.clearRect(0, 0, ctxWidth, ctxHeight);

  renderConnections();
  renderPoints();
}