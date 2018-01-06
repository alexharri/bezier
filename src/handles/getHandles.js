const store = require("../store");

function getAllHandles() {
  const handles = store.getState().handles;
  const handleArr = [];

  const keys = Object.keys(handles);
  for (let i = 0; i < keys.length; i += 1) {
    handleArr.push(handles[keys[i]]);
  }

  return handleArr;
}
exports.getAllHandles = getAllHandles;

exports.getHandleById = function getHandleById(id) {
  return store.getState().handles[id] || null;
}
