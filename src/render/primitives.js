const getContext = require("../canvas/getContext");
const isValidPosition = require("../utils/isValidPosition");

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

exports.renderCubicBezier = function renderCubicBezier(points, lineWidth = 1, color = "#444") {
  if (!Array.isArray(points)) {
    throw new Error(`Invalid points. Expected array but got ${points}.`);
  }

  if (points.length !== 4) {
    throw new Error(`Invalid points. Expected 4 but got ${points.length}.`);
  }

  points.forEach((point, i) => {
    if (!isValidPosition(point)) {
      throw new Error(`Invalid position at index ${i}`);
    }
  });

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

exports.renderQuadraticBezier = function renderQuadraticBezier(
  points,
  lineWidth = 1,
  color = "#444",
) {
  if (!Array.isArray(points)) {
    throw new Error(`Invalid points. Expected array but got ${points}.`);
  }

  if (points.length !== 3) {
    throw new Error(`Invalid points. Expected 3 but got ${points.length}.`);
  }

  points.forEach((point, i) => {
    if (!isValidPosition(point)) {
      throw new Error(`Invalid position at index ${i}`);
    }
  });

  const [ p0, p1, p2 ] = points;
  const ctx = getContext();

  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.quadraticCurveTo(
    (p1.x), (p1.y),
    (p2.x), (p2.y),
  );
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}