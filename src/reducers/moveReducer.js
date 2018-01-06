const defaultState = {};

/**
 * Keeps track of which objects have been moved.
 *
 * Works very similarly to the selectionReducer, but is simpler.
 *
 * If an item has been moved, you dispatch MOVE_ITEM to add it to the
 * list of moved items of that type.
 *
 * To see if an item has been moved, you simply check if it's id
 * exists in the list for that type.
 *
 * When a move is done, simply dispatch FINISH_MOVE.
 *
 * You can not remove a single item, only reset the entire state.
 */
module.exports = function reducer(state = defaultState, action) {
  switch (action.type) {
    case "MOVE_ITEM": {
      const { type, id } = action.payload;

      if (!type || typeof type !== "string") {
        throw new Error(`Invalid type. Expected string but got '${type}'.`);
      }

      if (!id || typeof id !== "string") {
        throw new Error(`Invalid id. Expected string but got '${id}'.`);
      }

      return {
        ...state,
        [type]: [
          ...(state[type] || []),
          id
        ],
      };
    }
    case "FINISH_MOVE": {
      return defaultState;
    }
    default: {
      return state;
    }
  }
}