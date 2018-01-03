const getContext = require("../../canvas/getContext");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const { getAllConnections } = require("../../connections/getConnections");
const { renderPointGuide, clearPointGuide } = require("./connectionGuides");

module.exports = function renderConnections() {
  const connections = getAllConnections();
  for (let i = 0; i < connections.length; i += 1) {
    const [ p0, p1, p2, p3 ] = getConnectionPoints(connections[i]);
    const ctx = getContext();
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
    
    
    ctx.fillStyle = "red";
    ctx.fillRect((p1.x - 4), (p1.y - 4), 8, 8); // handle point for a
    ctx.fillRect((p2.x - 4), (p2.y - 4), 8, 8); // handle point for b

    ctx.beginPath()
    ctx.strokeStyle = "#aaaaaa"; // Handle color

    // Handle for a
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p0.x, p0.y);

    // Handle for b
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();
  }

  renderPointGuide();
  clearPointGuide();
}