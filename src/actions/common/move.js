const toAction = (selection, positionChange) => ({
  type: "MOVE",
  payload: {
    selection,
    positionChange,
  },
});

module.exports = {
  redo: ({ selection, positionChange }) => toAction(selection, positionChange),
  undo: ({ selection, positionChange }) => toAction(selection, {
    x: positionChange.x * -1,
    y: positionChange.y * -1,
  }),
};
