const splitBezier = require("../../bezier/splitBezier");
const addPoint = require("../../actions/point/addPoint");
const addConnection = require("../../connections/addConnection");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const deleteConnection = require("../../connections/deleteConnection");
const shortid = require("shortid");
const render = require("../../render/render");

exports.redo = ({ connection, newPoints }) => {
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
      points: [aId, p3.id],
      handles: [p1, p2],
    }
  });
  actions.push({
    type: "ADD_CONNECTION",
    data: {
      points: [p3.id, bId],
      handles: [p4, p5],
    }
  });

  return actions;
}

// See above function
exports.undo = ({ connection, newPoints }) => {
  const actions = [];
  const [ aId, bId ] = connection.points;
  const p3 = newPoints[3];

  // We add the old connection
  actions.push({
    type: "ADD_CONNECTION",
    data: connection,
  });

  // And remove the new point
  actions.push({
    type: "DELETE_POINT",
    data: p3,
  })

  /**
   * And we delete the new connections.
   *
   * We don't need the handles for this, the points are just
   * used for id generation.
   */
  actions.push({
    type: "DELETE_CONNECTION",
    data: {
      points: [aId, p3.id],
    }
  });
  actions.push({
    type: "DELETE_CONNECTION",
    data: {
      points: [p3.id, bId],
    }
  });

  return actions;
}