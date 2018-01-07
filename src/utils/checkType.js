const { types } = require("../constants");

const typeArr = [];

{
  const keys = Object.keys(types);
  for (let i = 0; i < keys.length; i += 1) {
    typeArr.push(types[keys[i]]);
  }
}

exports.isValidType = function isValidType() {
  return typeArr.indexOf(type) > -1;
}

exports.checkType = function checkType(type) {
  if (typeArr.indexOf(type) === -1) {
    throw new Error(`Invalid type '${type}'.`);
  }
}
