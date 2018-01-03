const { addListener, removeListener } = require("../../listeners/listeners");
const setPointPosition = require("../../points/setPointPosition");
const { setCursor, releaseOverride } = require("../../../utils/cursor");

module.exports = function onHandleMouseDown({ handle, point: origin }) {
  let mouseMoved = false;
  let overrideId;
  
  const listenerId = addListener("mousemove", (position) => {
    if (!mouseMoved) {
      overrideId = setCursor("MOVE", { override: true });
    }
    mouseMoved = true;

    handle.x = position.x;
    handle.y = position.y;

    const sib = handle.sibling;
    const shouldMirror = false; // Should have a setting
    const shouldMirrorLength = false;

    if (sib && shouldMirror) {
      const oX = origin.x;
      const oY = origin.y;

      if (shouldMirrorLength) {
        /**
         * Here we just reverse the x and y coords of the handle.
         */
        const newX = (handle.x - oX) * -1;
        const newY = (handle.y - oY) * -1;

        sib.x = newX + oX;
        sib.y = newY + oY;
      } else {
        /**
         * Reference for the math behind rotating a vector.
         * https://stackoverflow.com/questions/14607640/rotating-a-vector-in-3d-space
         */

        // Mirroring the angle of the handle in rad
        const handleRad  = Math.atan2(handle.y - oY, handle.x - oX);
        const siblingRad = Math.atan2(   sib.y - oY,    sib.x - oX)
        const mirroredRad = (handleRad - siblingRad) + Math.PI;

        const sin = Math.sin(mirroredRad);
        const cos = Math.cos(mirroredRad);

        // Translate the position as if the origin (point) is (0,0).
        sib.x -= oX;
        sib.y -= oY;

        /**
         * This is the actual rotation
         *
         *    x' = x cos θ - y sin θ
         *    y' = x sin θ + y cos θ
         */
        const newX = (sib.x * cos) - (sib.y * sin);
        const newY = (sib.x * sin) + (sib.y * cos);

        // Translate position back
        sib.x = newX + oX;
        sib.y = newY + oY;
      }
    }
  });


  addListener("mouseup", () => {
    // Releasing the cursor override.
    if (typeof overrideId === "string") {
      releaseOverride(overrideId);
    }
    removeListener("mousemove", listenerId);
  }, true);
}