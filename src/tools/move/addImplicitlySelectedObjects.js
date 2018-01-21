const { getConnectionById } = require("../../connections/getConnections");
const { getPointHandleIds } = require("../../points/getPoints");
const { types } = require("../../constants");

/**
 * Creates a new selection and adds objects that are implicitly
 * selected by another object.
 *
 * For example:
 *    - Moving a connection also moves the connection's points
 *    - Moving a point also moves the point's handles.
 *
 * So if you move a connection, you move its points, and those
 * points will also move their handles.
 */
module.exports = function addImplicitlySelectedObjects(selection) {
  const newSelection = {};

  function addToSelection(type, id) {
    if (!Array.isArray(newSelection[type])) {
      newSelection[type] = [id];
    } else if (newSelection[type].indexOf(id) === -1) {
      newSelection[type].push(id);
    }
  }

  /**
   * Here is probably what you want to edit
   */
  function addImplicitlySelected(type, id) {
    if (type === types.POINT) {
      const handleIds = getPointHandleIds(id).filter(x => x);
      addArrayToSelection(types.HANDLE, handleIds);
    } else if (type === types.CONN) {
      const pointIds = getConnectionById(id).points;
      addArrayToSelection(types.POINT, pointIds);
    }
  }

  function addArrayToSelection(type, ids) {
    for (let i = 0; i < ids.length; i += 1) {
      addToSelection(type, ids[i]);
      addImplicitlySelected(type, ids[i]);
    }
  }
  
  const keys = Object.keys(selection);
  for (let i = 0; i < keys.length; i += 1) {
    const type = keys[i];

    if (!Array.isArray(newSelection[type])) {
      newSelection[type] = [];
    }

    for (let j = 0; j < selection[type].length; j += 1) {
      addToSelection(type, selection[type][j]);
      addImplicitlySelected(type, selection[type][j]);
    }
  }

  return newSelection;
}
