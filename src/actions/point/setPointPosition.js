const toAction = (ids, positionChange) => ({
  type: "SET_POINT_POSITION",
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
