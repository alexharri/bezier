const { addGuide } = require("../../render/guides");
const { getSelectedOfType } = require("../../selection");
const { setCursor } = require("../../utils/cursor");
const { types } = require("../../constants");

function setPenCursor(type) {
  if (type === types.CONN) {
    setCursor("PEN_ADD_POINT");
  } else if (type === types.HANDLE) {
    setCursor("DEFAULT");
  } else if (type === types.POINT) {
    setCursor("PEN_SELECT_POINT");
  }
}

module.exports = function onPenMouseMove(position, obj) {
  if (!obj) {
    // Show guide for new point creation
    addGuide(types.POINT, position);
    
    const selectedPoints = getSelectedOfType(types.POINT);
    if (selectedPoints.length === 1) {
      // Show guide curve between points
      // addGuide(types.CONN);
    }

    return;
  }

  const { value, type } = obj;

  setPenCursor(type);

  if (type === types.CONN) {
    const { closestPoint } = value;
    addGuide(types.POINT, value.closestPoint);
  }
}
