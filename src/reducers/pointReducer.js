const { types } = require("../constants");

const defaultState = {
  "a": {
    x: 40,
    y: 40,
  },
  "b": {
    x: 400,
    y: 200,
  },
};

module.exports = function reducer(state = defaultState, action) {
  switch (action.type) {
    case "MOVE": {
      const { selection, positionChange } = action.payload;
      const toMove = selection[types.POINT];

      if (!Array.isArray(toMove)) {
        return state;
      }

      const newState = {
        ...state,
      };

      for (let i = 0; i < toMove.length; i += 1) {
        const id = toMove[i];
        const { x, y } = state[id];
        newState[id] = {
          ...state[id],
          x: x + positionChange.x,
          y: y + positionChange.y,
        };
      }

      return newState;
    }
    case "ADD_POINT": {
      const { x, y, id } = action.payload;
      return {
        ...state,
        [id]: { x, y },
      }
    }
    case "DELETE_POINT": {
      console.log(action.payload);
      return Object.keys(state).reduce((newState, key) => {
        if (key !== action.payload) {
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