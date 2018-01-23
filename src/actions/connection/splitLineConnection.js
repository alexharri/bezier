module.exports = ({ ids, connection, newPoint }) => {
  const actions = [];
  
  const [ aId, bId ] = connection.points; // These are the point ids, not the actual points.

  // We remove the old connection
  actions.push({
    type: "DELETE_CONNECTION",
    data: connection,
  });

  // And add the new point
  actions.push({
    type: "ADD_POINT",
    data: newPoint,
  })

  // Adding the two new connections
  actions.push({
    type: "ADD_CONNECTION",
    data: {
      id: ids[0],
      points: [aId, newPoint.id],
      handles: [null, null],
    },
  });
  actions.push({
    type: "ADD_CONNECTION",
    data: {
      id: ids[1],
      points: [newPoint.id, bId],
      handles: [null, null],
    },
  });


  return actions;
}
