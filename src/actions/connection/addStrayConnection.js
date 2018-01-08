module.exports = ({ pointId, connectionId, handleId, handlePosition }) => ([
  {
    type: "ADD_CONNECTION",
    data: {
      id: connectionId,
      points: [pointId, null],
      handles: [handleId, null],
    }
  },
  {
    type: "ADD_HANDLES",
    data: [{
      x: handlePosition.x,
      y: handlePosition.y,
      id: handleId,
    }],
  }
]);
