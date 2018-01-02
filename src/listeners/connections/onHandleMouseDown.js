const { addListener, removeListener } = require("../../listeners/listeners");
const setPointPosition = require("../../points/setPointPosition");

module.exports = function onHandleMouseDown(handle) {
  const listenerId = addListener("mousemove", (position) => {
    handle.x = position.x;
    handle.y = position.y;
  });


  addListener("mouseup", () => {
    removeListener("mousemove", listenerId);
  }, true);
}