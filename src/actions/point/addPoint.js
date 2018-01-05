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
  undo: ({ id }) => ({
    type: "REMOVE_POINT",
    id,
  })
};
