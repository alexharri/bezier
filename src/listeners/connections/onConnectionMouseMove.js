import { setPointGuide } from "../../render/connections/connectionGuides";

const setCursor = require("../../../utils/setCursor");

module.exports = function onConnectionMouseMove({ closestPoint }) {
  setCursor("PEN_ADD_POINT");
  setPointGuide(closestPoint);
}
