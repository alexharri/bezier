module.exports = function calcDistanceBetweenPositions(a, b) {
  const dX = Math.abs(a.x - b.x); // difference on x axis
  const dY = Math.abs(a.y - b.y); // difference on y axis
  return (dX * dX) + (dY * dY); // shoutout pythagoras
}
