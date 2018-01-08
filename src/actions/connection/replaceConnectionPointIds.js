const store = require("../../store");

exports.undo = (data) => {
  throw new Error("replaceConnectionPointIds has not been defined.");
};

exports.redo = (data) => {
  return {
    type: "REPLACE_CONNECTION",
    payload: data,
  };
};
