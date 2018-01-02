const getPointHandles = require("../points/getPointHandles");
const isValidPosition = require("../../utils/isValidPosition");

module.exports = function setPointHandlePositions(positionChange, pointId) {
  const handles = getPointHandles(pointId);
  for (let i = 0; i < handles.length; i += 1) {
    handles[i].x += positionChange.x;
    handles[i].y += positionChange.y;
  }
}
