const x = "x";
const y = "y";

const defaultState = {
  [x]: { x: 240, y: 20,   id: x },
  [y]: { x: 360, y: 500,  id: y },
};

module.exports = function reducer(state = defaultState, action) {
  switch (action.type) {
    case "SET_HANDLE_POSITION": {
      const { ids, positionChange } = action.payload;

      const newState = {
        ...state,
      };

      for (let i = 0; i < ids.length; i += 1) {
        const id = ids[i];
        const { x, y } = state[id];
        newState[id] = {
          ...state[id],
          x: x + positionChange.x,
          y: y + positionChange.y,
        };
      }

      return newState;
    }
    case "ADD_HANDLES": {
      const newState = { ...state };
      const handles = action.payload;

      for (let i = 0; i < handles.length; i += 1) {
        const { id, x, y } = handles[i];
        newState[id] = { x, y, id };
      }

      return newState;
    }
    case "DELETE_HANDLES": {
      const handleIds = action.payload;
      return Object.keys(state).reduce((newState, key) => {
        if (handleIds.indexOf(key) < 0) {
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