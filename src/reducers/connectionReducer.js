const { toConnectionId } = require("../connections/connectionId");

const a = "a";
const b = "b";
const x = "x";
const y = "y";

const defaultState = {
  [toConnectionId(a, b)]: {
    id: toConnectionId(a, b),
    points: [a, b],
    handles: [x, y],
  },
}

module.exports = function reducer(state = defaultState, action) {
  switch (action.type) {
    case "ADD_CONNECTION": {
      const { id } = action.payload;

      return {
        ...state,
        [id]: action.payload,
      };
    }
    case "REPLACE_CONNECTION": {
      const { handles, points, id } = action.payload;

      if (!state[id]) {
        throw new Error(`Connection by id '${id}' does not exist.`);
      }

      return {
        ...state,
        [id]: {
          ...state[id],
          handles: handles.map((handle, i) => (
            handle === undefined
              ? state[id].handles[i]
              : handle
          )),
          points: points.map((point, i) => (
            point === undefined
              ? state[id].points[i]
              : point
          )),
        }
      };
    }
    case "DELETE_CONNECTION": {
      const id = action.payload;

      return Object.keys(state).reduce((newState, key) => {
        if (key !== id) {
          newState[key] = state[key];
        }
        return newState;
      }, {});
    }
    default: {
      return state;
    }
  }
}