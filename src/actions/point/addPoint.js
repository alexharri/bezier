const isValidPosition = require("../../utils/isValidPosition");

module.exports = {
  redo: (point) => {
    if (!isValidPosition(point)) {
      throw new Error("Invalid position.");
    }

    if (!point.id || typeof point.id !== "string") {
      throw new Error(`Invalid point id. Expected string but got '${point.id}'.`);
    }

    return {
      type: "ADD_POINT",
      payload: point,
    };
  },
  undo: ({ id }) => {
    if (!id || typeof id !== "string") {
      throw new Error(`Invalid point id. Expected string but got '${id}'.`);
    }

    return {
      type: "DELETE_POINT",
      payload: id,
    };
  },
};
