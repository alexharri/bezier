const { setPointGuide } = require("../../render/connections/connectionGuides");
const { setCursor } = require("../../../utils/cursor");
const { types } = require("../../constants");

module.exports = function onPenMouseMove(position, obj) {
  if (!obj) {
    return;
  }

  const { value, type } = obj;

  if (type === types.CONN) {
    const { closestPoint } = value;
    setCursor("PEN_ADD_POINT");
    setPointGuide(value.closestPoint);
  }

  if (type === types.HANDLE || type === types.POINT) {
    setCursor("DEFAULT");
  }
}