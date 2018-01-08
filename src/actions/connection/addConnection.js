const { toConnectionId } = require("../../connections/connectionId");

exports.redo = ({ points, handles, id }) => ({
  type: "ADD_CONNECTION",
  payload: {
    id,
    points,
    handles,
  },
});

exports.undo = ({ id }) => {
  return {
    type: "DELETE_CONNECTION",
    payload: id,
  };
}
