const { types } = require("../../constants");

/**
 * "Pen point" just means that the point was dragged/connected
 * or some other was applied to it other than creating a single
 * point.
 *
 * I can't find a better name for this, I'm sorry.
 */
module.exports = function addPenPoint(data) {
  const {
    point,
    newHandle,
    newConnection,
    movedHandle,
    strayConnection,
    completedConnection,
    newCompletedConnectionHandle, // Don't judge me.
  } = data;

  const actions = [
    { // The initial point that was created when we clicked.
      type: "ADD_POINT",
      data: point,
    },
  ];

  /**
   * The handle and connection for the NEW stray connection.
   *
   * This is NOT the handle for the connection that this point
   * completes (if it does).
   */
  if (newHandle) {
    actions.push({
      type: "ADD_CONNECTION",
      data: newConnection,
    });
    actions.push({
      type: "ADD_HANDLES",
      data: [newHandle],
    });
  }

  /**
   * This is the stray action that was completed.
   *
   * The new handle id (if present) will be included in the
   * completedConnection object.
   */
  if (completedConnection) {
    actions.push({
      type: "REPLACE_CONNECTION_POINT_IDS",
      data: {
        oldConnection: strayConnection,
        newConnection: completedConnection,
      }
    });

    // The handle that was present on the completedConnection (p2).
    if (movedHandle) {
      const { id, positionChange } = movedHandle;
      actions.push({
        type: "MOVE",
        data: {
          selection: {
            [types.HANDLE]: [id],
          },
          positionChange,
        },
      });
    }

    // The new handle for the completed connection (p2).
    if (!newCompletedConnectionHandle) {
      actions.push({
        type: "ADD_HANDLES",
        data: [newCompletedConnectionHandle],
      });
    }
  }

  return actions;
}
