const { toConnectionId } = require("../../connections/connectionId");

exports.redo = (data) => {
  const { points, handles } = data;
  const id = toConnectionId(points[0], points[1]);

  return {
    type: "ADD_CONNECTION",
    payload: {
      id,
      points,
      handles,
    },
  }
};

exports.undo = data => ({
  type: "DELETE_CONNECTION",
  payload: toConnectionId(data.points[0], data.points[1]),
});
