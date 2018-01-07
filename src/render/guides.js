const { checkType } = require("../utils/checkType");

let guides = {};

exports.addGuide = function addGuide(type, value) {
  checkType(type);

  
  if (!Array.isArray(guides[type])) {
    guides[type] = [value];
  } else {
    guides[type].push(value);
  }

}

exports.resetGuides = function resetGuides() {
  guides = {};
}

exports.getGuidesOfType = function getGuidesOfType(type) {
  checkType(type);
  return guides[type] || [];
}
