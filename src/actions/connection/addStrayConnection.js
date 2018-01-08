exports.redo = ({ pointId, connectionId, handleId, handlePosition }) => {
  const actions = [];

  actions.push({
    type: "ADD_CONNECTION",
    data: {
      id: connectionId,
      points: [pointId, null],
      handles: [handleId, null],
    }
  });
  actions.push({
    type: "ADD_HANDLES",
    data: [{
      x: handlePosition.x,
      y: handlePosition.y,
      id: handleId,
    }],
  });

  return actions;
}

exports.undo = ({ connectionId, handleId }) => {
  const actions = [];

  actions.push({
    type: "DELETE_CONNECTION",
    data: { id: connectionId },
  });
  actions.push({
    type: "DELETE_HANDLES",
    data: [{ id: handleId }],
  });

  return actions;
}
