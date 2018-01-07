function calcNewHandles(p0, p3, p1) {
  return [
    { // p2
      x: p1.x + ((p3.x - p1.x) * 0.4),
      y: p1.y + ((p3.y - p1.y) * 0.4),
    },
    { // p3
      x: p0.x + ((p3.x - p0.x) * 0.85),
      y: p0.y + ((p3.y - p0.y) * 0.85),
    },
  ];
}

module.exports = function splitBezier(p0, p1, p2, p3) {
  if (p1 === null) {
    if (p2 === null) {
      throw new Error(`Expected p2 not to be null.`);
    }

    // Flipping
    const [ newP2, newP1 ] = calcNewHandles(p3, p2, p0);
    return [p0, newP1, newP2, p3];
  }

  if (p2 === null) {
    if (p1 === null) {
      throw new Error(`Expected p1 not to be null.`);
    }

    const [ newP1, newP2 ] = calcNewHandles(p0, p1, p3);
    return [p0, newP2, newP1, p3];
  }

  throw new Error("Expected either p1 or p2 to be null.");
}
