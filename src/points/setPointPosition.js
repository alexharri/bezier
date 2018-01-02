const { getPointById } = require("./getPoints");
const isValidPosition = require("../../utils/isValidPosition");
const setPointHandlePositions = require("../connections/setPointHandlePositions");

module.exports = function setPointPosition(id, position) {
  const point = getPointById(id);

  if (!point) {
    throw new Error(`Could not find point by id '${id}`);
  }

  if (!isValidPosition(position)) {
    throw new Error("Invalid position");
  }

  const positionChange = {
    x: position.x - point.x,
    y: position.y - point.y,
  };

  point.x = position.x;
  point.y = position.y;

  setPointHandlePositions(positionChange, id);
}