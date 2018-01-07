const getPosDifference = (oldPos, newPos) => ({
  x: newPos.x - oldPos.x,
  y: newPos.y - oldPos.y,
});

module.exports = getPosDifference;
