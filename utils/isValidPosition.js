module.exports = function isValidPosition(position) {
  return (
    position &&
    typeof position === "object" &&
    typeof position.x === "number" &&
    typeof position.y === "number");
}
