const store = require("./store");

const _validatedTypes = []; // To avoid unnecessary getState calls

function validateType(type) {
  if (_validatedTypes.indexOf(type) > -1) {
    return;
  }

  if (!type || typeof type !== "string") {
    throw new Error(`Invalid type. Expected string but got '${type}'.`);
  }

  store.dispatch({
    type: "ADD_SELECTION_TYPE",
    payload: type,
  })

  _validatedTypes.push(type);
}

function getSelectedOfType(type) {
  validateType(type);
  return store.getState().selection[type];
}
exports.getSelectedOfType = getSelectedOfType;

exports.addToSelection = function addToSelection(type, id) {
  const selectedOfType = getSelectedOfType(type);
  if (selectedOfType.indexOf(id) < 0) {
    store.dispatch({
      type: "ADD_TO_SELECTION",
      payload: { type, id },
    });
  }
}

exports.removeFromSelection = function removeFromSelection(type, id) {
  const itemIndex = getSelectedOfType(type).indexOf(id);
  if (itemIndex > -1) {
    store.dispatch({
      type: "REMOVE_FROM_SELECTION",
      payload: { type, itemIndex },
    });
  }
}

exports.isSelected = function isSelected(type, id) {
  return getSelectedOfType(type).indexOf(id) > -1;
}

exports.clearSelection = function clearSelection() {
  store.dispatch({
    type: "CLEAR_SELECTION",
  });
}

/**
 * Returns a new object with a new array for each type
 * with the current ids selected for said type.
 */
exports.copySelection = function copySelection() {
  const currentSelection = store.getState().selection;
  
  const copy = {};
  const keys = Object.keys(currentSelection);
  for (let i = 0; i < keys.length; i += 1) {
    copy[keys[i]] = [...currentSelection[keys[i]]];
  }
  return copy;
}

/**
 * ONLY TO BE USED BY THE HISTORY MODULE
 */
exports._pasteSelection = function pasteSelection(selection) {
  store.dispatch({
    type: "RESTORE_SELECTION",
    payload: selection,
  });
}
