module.exports = ({ connection, newPoints, ids }) => {
  const actions = [];
  
  const [ aId, bId ] = connection.points; // These are the point ids, not the actual points.

  /**
   * p0 is a (the left hand point)
   * p6 is b (the right hand point)
   * p3 is the new point.
   *
   * We don't need to use p0 or p6, they're the exact same as a and b.
   *
   * The other points (p1, p2, p4, p5) are the handles.
   */
  const [ p0, p1, p2, p3, p4, p5, p6 ] = newPoints; // From the splitBezier function

  // We remove the old connection
  actions.push({
    type: "DELETE_CONNECTION",
    data: connection,
  });

  // And add the new point
  actions.push({
    type: "ADD_POINT",
    data: p3,
  })

  /**
   * Notice how we give the ids of the points for the first
   * and last parameter, not the actual points themselves.
   *
   * p1, p2, p3, p4 are actual points but have been given ids by
   * the listener.
   */
  actions.push({
    type: "ADD_CONNECTION",
    data: {
      id: ids[0],
      points: [aId, p3.id],
      handles: [p1.id, p2.id],
    }
  });
  actions.push({
    type: "ADD_CONNECTION",
    data: {
      id: ids[1],
      points: [p3.id, bId],
      handles: [p4.id, p5.id],
    }
  });

  // Adding the handles
  actions.push({
    type: "ADD_HANDLES",
    data: [p1, p2, p4, p5],
  });

  return actions;
}
