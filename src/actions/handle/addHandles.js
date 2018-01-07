const isValidPosition = require("../../utils/isValidPosition");

module.exports = {
  redo: (handles) => {
    for (let i = 0; i < handles.length; i += 1) {
      if (!isValidPosition(handles[i])) {
        throw new Error("Invalid handle.");
      }

      if (!handles[i].id || typeof handles[i].id !== "string") {
        throw new Error(`Invalid handle id. Expected string but got '${handles[i].id}'.`);
      }
    }

    return {
      type: "ADD_HANDLES",
      payload: handles,
    };
  },
  undo: (handles) => {
    for (let i = 0; i < handles.length; i += 1) {
      if (!handles[i].id || typeof handles[i].id !== "string") {
        throw new Error(`Invalid handle id. Expected string but got '${handles[i].id}'.`);
      }
    }

    return {
      type: "DELETE_HANDLES",
      payload: handles.map(({ id }) => id),
    };
  },
};
