const { types } = require("../../constants");

module.exports = function addPointComplex(data) {
  const {
    point,
    newHandle,
    newConnection,
    movedHandle,
    completedConnection,
    newCompletedConnectionHandle, // Don't judge me.
  } = data;

  const actions = [
    {
      type: "ADD_POINT",
      data: point,
    },
  ];

  /**
   * The handle for the NEW stray connection.
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
      data: completedConnection,
    });

    // The handle that was present on the completedConnection
    if (movedHandle) {
      const { id, positionChange } = movedHandle;
      actions.push({
        type: "MOVE",
        selection: {
          [types.HANDLE]: [id],
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
