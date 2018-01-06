const { getAllHandles } = require("./getHandles");
const calcDistanceBetweenPositions = require("../../utils/calcDistanceBetweenPositions");
const { getPointById } = require("../points/getPoints");

module.exports = function getHandleAtPosition(position, getPoint) {
  const handles = getAllHandles();
  let closestHandle;
  let closestDistance;

  for (let i = 0; i < handles.length; i += 1) {
    const distance = calcDistanceBetweenPositions(position, handles[i]);
    if (!closestDistance || distance < closestDistance) {
      closestHandle = handles[i];
      closestDistance = distance;
    }
  }

  if (closestDistance < 225) { // 15px
    return closestHandle;
  }

  return null;
}
