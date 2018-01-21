const { getHandleById } = require("../../handles/getHandles");
const { getSelectedOfType } = require("../../selection");
const { getPointById } = require("../../points/getPoints");
const { renderCircle, renderLine } = require("../primitives");
const getContext = require("../../canvas/getContext");
const { colors } = require("../../constants");

const { PRIMARY, PRIMARY_LIGHT } = colors;

function renderHandle(point, handle, opts) {
  const isHandleSelected = getSelectedOfType("__HANDLE").indexOf(handle.id) > -1;

  /** 
   * Drawing the line between the point and handle.
   *
   * Check is connection selected aswell when implemented.
   */
  const lineColor = isHandleSelected ? PRIMARY_LIGHT : "#aaa";
  renderLine(point, handle, lineColor, 1);


  // Drawing the handle itself
  const handleColor = isHandleSelected ? PRIMARY : "#999";
  const handleSize = isHandleSelected ? 4 : 3;
  renderCircle(handle, handleSize, handleColor);
}


module.exports = function renderHandles(connection) {
  for (let i = 0; i < connection.handles.length; i += 1) {
    if (connection.handles[i] && connection.points[i]) {

      const handle = getHandleById(connection.handles[i]);
      const point = getPointById(connection.points[i]);

      renderHandle(point, handle);
    }
  }
}