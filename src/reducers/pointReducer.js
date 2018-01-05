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
    case "SET_POINT_POSITION": {
      const { ids, positionChange } = action.payload;

      const newState = {
        ...state,
      };

      for (let i = 0; i < ids.length; i += 1) {
        const id = ids[i];
        const { x, y } = state[id];
        newState[id] = {
          ...[state.id],
          x: x + positionChange.x,
          y: y + positionChange.y,
        };
      }

      return newState;
    }
    default: {
      return state;
    }
  }
}