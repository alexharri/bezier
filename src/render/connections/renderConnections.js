const getContext = require("../../canvas/getContext");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const { getAllConnections } = require("../../connections/getConnections");
const renderHandles = require("./renderHandles");

module.exports = function renderConnections() {
  const connections = getAllConnections();
  for (let i = 0; i < connections.length; i += 1) {
    const points = getConnectionPoints(connections[i])
    const [ p0, p1, p2, p3 ] = points;
    const ctx = getContext();

    /**
     * Drawing the actual bezier path
     */
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(
      (p1.x), (p1.y),
      (p2.x), (p2.y),
      (p3.x), (p3.y),
    );
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Drawing the handles (and handle lines)
    renderHandles(connections[i]);
  }
}