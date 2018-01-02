const { addListener, removeListener } = require("../../listeners/listeners");
const setPointPosition = require("../../points/setPointPosition");

module.exports = function onPointMouseDown({ id }) {
  const listenerId = addListener("mousemove", (position) => {
    setPointPosition(id, position);
  });


  addListener("mouseup", () => {
    removeListener("mousemove", listenerId);
  }, true);
}