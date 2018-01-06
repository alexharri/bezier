const { getPointHandleIds } = require("../../points/getPoints");

const toAction = (ids, positionChange) => {
  const actionArr = [
    {
      type: "SET_POINT_POSITION",
      data: {
        ids,
        positionChange,
      },
    },
    ...ids.map(id => ({
      type: "SET_HANDLE_POSITION",
      data: {
        ids: getPointHandleIds(id),
        positionChange,
      },
    })),
  ];
  return actionArr;
};

module.exports = {
  redo: ({ ids, positionChange }) => toAction(ids, positionChange),
  undo: ({ ids, positionChange }) => toAction(ids, {
    x: positionChange.x * -1,
    y: positionChange.y * -1,
  }),
};
