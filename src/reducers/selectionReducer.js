const defaultState = {};

/**
 * Whether or not the id needs to be added/removed is checked
 * by the selection.js methods.
 * This reducer assumes ids being removed exist in the array
 * and ids that are being added don't.
 */
module.exports = function reducer(state = defaultState, action) {
  switch (action.type) {
    case "ADD_SELECTION_TYPE": {
      return {
        ...state,
        [action.payload]: [],
      };
    }
    case "ADD_TO_SELECTION": {
      const { id, type } = action.payload;
      return {
        ...state,
        [type]: [
          ...state[type],
          id,
        ],
      };
    }
    case "REMOVE_FROM_SELECTION": {
      const { type, itemIndex } = action.payload;
      return {
        ...state,
        [type]: state[type].filter((id, i) => (i !== itemIndex)),
      }
    }
    case "CLEAR_SELECTION": {
      // We turn every array into a new empty array!
      const newState = {};

      const keys = Object.keys(state);
      for (let i = 0; i < keys.length; i += 1) {
        newState[keys[i]] = [];
      }

      return newState;
    }
    case "RESTORE_SELECTION": {
      // We simply pass in the old state...
      const newState = {
        ...action.payload,
      };

      /**
       * ...but not so fast bucko, we might have new types in the
       * validated types that didn't exists in the state being
       * restored.
       * To amend that we simply add arrays for the new validated
       * types.
       */
      const keys = Object.keys(state);
      for (let i = 0; i < keys.length; i += 1) {
        if (!Array.isArray(newState[keys[i]])) {
          newState[keys[i]] = [];
        }
      }

      return newState;
    }
    default: {
      return state;
    }
  }
}