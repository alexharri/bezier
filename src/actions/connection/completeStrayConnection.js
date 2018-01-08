const { getHandleById } = require("../../handles/getHandles");
const getPosDifference = require("../../utils/getPosDifference");
const { types } = require("../../constants");

module.exports = (data) => {
  const actions = [];
  
  const [ p0, p1, p2, p3 ] = data.newPoints;
  const pointIds = data.pointIds;

  const { connection } = data;

  actions.push({
    // pointIds is loosely defined as point and handle ids here.
    type: "REPLACE_CONNECTION_POINT_IDS",
    data: {
      newConnection: {
        id: connection.id,
        points: [
          connection.points[0],
          pointIds[3],
        ],
        handles: [
          connection.handles[0],
          pointIds[2],
        ],
      },
      oldConnection: connection,
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
};
