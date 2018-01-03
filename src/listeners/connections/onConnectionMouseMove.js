const { setPointGuide } = require("../../render/connections/connectionGuides");
const { setCursor } = require("../../../utils/cursor");

module.exports = function onConnectionMouseMove({ closestPoint }) {
  setCursor("PEN_ADD_POINT");
  setPointGuide(closestPoint);
}
