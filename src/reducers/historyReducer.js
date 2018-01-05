const defaultState = {
  history: [],
  future: [],
};

const maxLen = 5;

module.exports = function reducer(state = defaultState, action) {
  switch (action.type) {
    case "CLEAR_HISTORY": {
      return defaultState;
    }
    case "ADD_ACTION_TO_HISTORY": {
      return {
        ...state,
        history: [
          ...state.history.slice(state.history.length === maxLen ? 1 : 0),
          action.payload,
        ],
        future: [],
      };
    }
    case "UNDO": {
      if (state.history.length === 0) {
        return state;
      }
      return {
        ...state,
        future: [
          ...state.future,
          state.history[state.history.length - 1],
        ],
        history: state.history.splice(0, state.history.length - 1),
      };
    }
    case "REDO": {
      if (state.future.length === 0) {
        return state;
      }
      return {
        ...state,
        history: [
          ...state.history,
          state.future[state.future.length - 1],
        ],
        future: state.future.splice(0, state.future.length - 1),
      };
    }
    default: {
      return state;
    }
  }
}