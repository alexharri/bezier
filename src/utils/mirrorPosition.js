const defaultOpts = {
  mirrorLength: true,
};

module.exports = function mirrorPosition(position, origin, opts = defaultOpts) {
  const oX = origin.x;
  const oY = origin.y;

  if (opts.mirrorLength) {
    // Here we just reverse the x and y coords of the handle.
    const newX = (position.x - oX) * -1;
    const newY = (position.y - oY) * -1;

    return {
      x: newX + oX,
      y: newY + oY,
    };
  } else {
    const mirror = { ...opts.positionToMirror };

    /**
     * Reference for the math behind rotating a vector.
     * https://stackoverflow.com/questions/14607640/rotating-a-vector-in-3d-space
     */

    const positionRad = Math.atan2(   pos.y - oY,    pos.x - oX);
    const mirrorRad   = Math.atan2(mirror.y - oY, mirror.x - oX)
    const mirroredRad = (positionRad - mirrorRad) + Math.PI; // + PI to flip it

    const sin = Math.sin(mirroredRad);
    const cos = Math.cos(mirroredRad);

    // Translate the position as if the origin (point) is (0,0).
    mirror.x -= oX;
    mirror.y -= oY;

    /**
     * This is the actual rotation
     *
     *    x' = x cos θ - y sin θ
     *    y' = x sin θ + y cos θ
     */
    const newX = (mirror.x * cos) - (mirror.y * sin);
    const newY = (mirror.x * sin) + (mirror.y * cos);

    // Translate position back
    mirror.x = newX + oX;
    mirror.y = newY + oY;

    return mirror;
  }
}
