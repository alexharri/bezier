const store = require("../../store");

exports.undo = (data) => {
  const { oldConnection } = data;
  return {
    type: "REPLACE_CONNECTION_POINT_IDS",
    payload: oldConnection,
  };
};

exports.redo = (data) => {
  const { newConnection } = data;
  return {
    type: "REPLACE_CONNECTION_POINT_IDS",
    payload: newConnection,
  };
};
