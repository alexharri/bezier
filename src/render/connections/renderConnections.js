import { getGuidesOfType } from "../guides";

const getContext = require("../../canvas/getContext");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const { getAllConnections } = require("../../connections/getConnections");
const renderHandles = require("./renderHandles");
const { types, colors } = require("../../constants");

function drawPath(points, lineWidth = 1, color = "#444") {
  const [ p0, p1, p2, p3 ] = points;
  const ctx = getContext();

  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.bezierCurveTo(
    (p1.x), (p1.y),
    (p2.x), (p2.y),
    (p3.x), (p3.y),
  );
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

module.exports = function renderConnections() {
  const connections = getAllConnections();
  for (let i = 0; i < connections.length; i += 1) {
    const points = getConnectionPoints(connections[i]);
    if (points.indexOf(null) === -1) {
      drawPath(points);
    }

    // Drawing the handles (and handle lines)
    renderHandles(connections[i]);
  }

  getGuidesOfType(types.CONN).forEach((guide) => {
    drawPath(guide, 1, colors.PRIMARY);
  });

  getGuidesOfType(types.LINE).forEach((line) => {
    const ctx = getContext();

    console.log(line);
    
    ctx.beginPath();
    ctx.moveTo(line.from.x, line.from.y);
    ctx.lineTo(line.to.x, line.to.y);
    ctx.strokeStyle = colors.PRIMARY;
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}