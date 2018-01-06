const toAction = (ids, positionChange) => ({
  type: "SET_HANDLE_POSITION",
  payload: {
    ids,
    positionChange,
  },
});

module.exports = {
  redo: ({ ids, positionChange }) => toAction(ids, positionChange),
  undo: ({ ids, positionChange }) => toAction(ids, {
    x: positionChange.x * -1,
    y: positionChange.y * -1,
  }),
};
