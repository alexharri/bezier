const { toConnectionId } = require("../connections/connectionId");

const a = "a";
const b = "b";

const defaultState = {
  [toConnectionId(a, b)]: {
    id: toConnectionId(a, b),
    points: [a, b],
    handles: [
      { x: 240, y: 20 },
      { x: 360, y: 500 },
    ],
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