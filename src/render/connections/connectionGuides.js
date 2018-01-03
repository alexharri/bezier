const isValidPosition = require("../../../utils/isValidPosition");
const getContext = require("../../canvas/getContext");
const { renderCircle } = require("../primitives");

let pointGuide = null;

exports.setPointGuide = function setPointGuide(position) {
  if (!isValidPosition(position)) {
    throw new Error("Invalid position.");
  }

  pointGuide = {
    x: position.x,
    y: position.y,
  };
}

exports.clearPointGuide = function clearPointGuide() {
  pointGuide = null;
}

exports.getPointGuide = function getPointGuide() {
  return pointGuide;
}

exports.renderPointGuide = function renderPointGuide() {
  if (pointGuide) {
    const ctx = getContext();
    renderCircle(pointGuide, 4, "#555", { color: "#000" });
  }
}
