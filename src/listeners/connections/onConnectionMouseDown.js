const splitBezier = require("../../bezier/splitBezier");
const addPoint = require("../../points/addPoint");
const addConnection = require("../../connections/addConnection");
const getConnectionPoints = require("../../connections/getConnectionPoints");
const deleteConnection = require("../../connections/deleteConnection");
const shortid = require("shortid");
const render = require("../../render/render");

module.exports = function onConnectionMouseDown({ connection, closestPoint }) {
  const [ a, b ] = connection.points; // These are the point ids, not the actual points.
  const { t } = closestPoint; // t is where we split the path

  /**
   * a is the left hand point
   * b is the right hand point
   * p3 is the new point.
   *
   * The other points (p1, p2, p4, p5) are the handles.
   */
  const [ p0, p1, p2, p3, p4, p5, p6 ] = splitBezier(getConnectionPoints(connection), t);

  // We remove the old connection
  deleteConnection(connection.id);
  
  // Giving the handles ids.
  p1.id = shortid();
  p2.id = shortid();
  p4.id = shortid();
  p5.id = shortid();
  
  // p2 and p4 will be siblings
  p2.sibling = p4;
  p4.sibling = p2;

  const newPointId = addPoint(p3);

  /**
   * Notice how we give the ids of the points for the first
   * and last parameter, not the actual points themselves.
   *
   * The order here matters.
   */
  addConnection(a, p1, p2, newPointId);
  addConnection(newPointId, p4, p5, b);
}