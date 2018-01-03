const getContext = require("../canvas/getContext");

exports.renderCircle = function renderCircle(points, radius, color, stroke) {
  const ctx = getContext();
  
  if (!Array.isArray(points)) {
    points = [points];
  }

  ctx.fillStyle = color;
  for (let i = 0; i < points.length; i += 1) {
    const { x, y } = points[i];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();

    if (stroke) {
      if (typeof stroke !== "object") {
        throw new Error(`Invalid stroke. Expected object but got '${stroke}'.`)
      }

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.lineWidth = stroke.width || 1;
      ctx.strokeStyle = stroke.color || "#000000";
      ctx.stroke();
    }
  }
}
