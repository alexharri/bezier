const { toConnectionId } = require("../connections/connectionId");
const { checkValidConnection, checkIdArray } = require("../connections/checkValidConnection");

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
      checkValidConnection(action.payload);
      const { id } = action.payload;

      if (state[id]) {
        throw new Error(`There is already a connection by the id '${id}'`);
      }

      return {
        ...state,
        [id]: action.payload,
      };
    }
    case "REPLACE_CONNECTION_POINT_IDS": {
      const { id, handles, points } = action.payload;

      if (!state[id]) {
        throw new Error(`Connection by id '${id}' does not exist.`);
      }

      if (handles)  { checkIdArray(handles); }
      if (points)   { checkIdArray(points); }

      return {
        ...state,
        [id]: {
          ...state[id],
          handles:  handles || state[id].handles,
          points:   points  || state[id].points,
        },
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