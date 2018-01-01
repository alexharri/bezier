const getConnectionPoints = require("./getConnectionPoints");

/**
 * Takes in a connection and a t value and returns the point
 * on the connection at said t value.
 */
module.exports = function calcBezierPointAt(connection, t) {
  const [ p0, p1, p2, p3 ] = getConnectionPoints(connection);
  const u = 1 - t;

  function calcPart(which) {
    let p =           Math.pow(u, 3) * p0[which]; // first term
        p += 3 * t *  Math.pow(u, 2) * p1[which]; // second term
        p += 3 * u *  Math.pow(t, 2) * p2[which]; // third term
        p +=          Math.pow(t, 3) * p3[which]; // fourth term
    return p;
  }

  const x = calcPart("x");
  const y = calcPart("y");

  return { x, y, t };
}
