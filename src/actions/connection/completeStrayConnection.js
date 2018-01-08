const { getHandleById } = require("../../handles/getHandles");
const getPosDifference = require("../../utils/getPosDifference");
const { types } = require("../../constants");

exports.redo = (data) => {
  const actions = [];
  
  const [ p0, p1, p2, p3 ] = data.newPoints;
  const pointIds = data.pointIds;

  const { connection } = data;

  actions.push({
    // pointIds is loosely defined as point and handle ids here.
    type: "REPLACE_CONNECTION_POINT_IDS",
    data: {
      id: connection.id,
      points: [
        undefined,
        pointIds[3],
      ],
      handles: [
        undefined,
        pointIds[2],
      ],
    },
  });

  // The point at the clicked position
  actions.push({
    type: "ADD_POINT",
    data: { ...p3, id: pointIds[3] }
  });

  // The handle for the clicked position point (statement above).
  actions.push({
    type: "ADD_HANDLES",
    data: [{ ...p2, id: pointIds[2] }],
  });

  // The handle that was present on the stray connection
  actions.push({
    type: "MOVE",
    data: {
      selection: {
        [types.HANDLE]: [data.handleId],
      },
      positionChange: getPosDifference(getHandleById(connection.handles[0]), p1),
    },
  });

  return actions;
}

// See above function
exports.undo = (data) => {
  const actions = [];
  
  const [ p0, p1, p2, p3 ] = data.newPoints;
  const pointIds = data.pointIds;

  const { connection } = data;

  const handleId  = connection.handles[0];
  const pointId   = connection.points[0];

  actions.push({
    // pointIds is loosely defined as point and handle ids here.
    type: "REPLACE_CONNECTION_POINT_IDS",
    data: {
      id: connection.id,
      points: [
        undefined,
        null,
      ],
      handles: [
        undefined,
        null,
      ],
    },
  });

  // The point at the clicked position
  actions.push({
    type: "DELETE_POINT",
    data: { id: pointIds[3] },
  });

  // The handle for the clicked position point (statement above).
  actions.push({
    type: "DELETE_HANDLES",
    data: [{ id: pointIds[2] }],
  });

  const positionChange = getPosDifference(getHandleById(connection.handles[0]), p1);

  // The handle that was present on the stray connection
  actions.push({
    type: "MOVE",
    data: {
      selection: {
        [types.HANDLE]: [handleId],
      },
      positionChange: {
        x: positionChange.x * -1,
        y: positionChange.y * -1,
      },
    },
  });

  return actions;
}