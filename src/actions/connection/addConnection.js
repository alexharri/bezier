const { toConnectionId } = require("../../connections/connectionId");

exports.redo = (data) => {
  const { points, handles, id } = data;

  return {
    type: "ADD_CONNECTION",
    payload: {
      id,
      points,
      handles,
    },
  }
};

exports.undo = ({ id }) => {
  return {
    type: "DELETE_CONNECTION",
    payload: id,
  };
}
