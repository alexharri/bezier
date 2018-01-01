const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

module.exports = function getContext() {
  return ctx;
}
