const getContext = require("../canvas/getContext");
const isValidPosition = require("../../utils/isValidPosition");

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

exports.renderLine = function renderLine(from, to, color = "#aaa", width = 1) {
  const ctx = getContext();

  if (!isValidPosition(from)) {
    throw new Error("Invalid position 'from'.");
  }

  if (!isValidPosition(to)) {
    throw new Error("Invalid position 'to'.");
  }

  if (typeof color !== "string") {
    throw new Error(`Invalid color. Expected string but got '${color}'.`);
  }

  if (typeof width !== "number") {
    throw new Error(`Invalid width. Expected number but got '${width}'.`);
  }

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}