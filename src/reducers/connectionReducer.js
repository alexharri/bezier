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