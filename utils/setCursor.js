const canvas = document.getElementById("canvas");
const cursorMap = {
  DEFAULT: "",
  PEN_ADD_POINT: "pen_add_point.png",
};
let currentCursor = "DEFAULT";

module.exports = function setCursor(cursor) {
  if (typeof cursorMap[cursor] === "undefined") {
    throw new Error(`Invalid cursor '${cursor}'.`);
  }

  if (cursor === currentCursor) {
    return;
  }

  currentCursor = cursor;
  let cursorStyle = cursorMap[cursor]
    ? `url(/static/images/${cursorMap[cursor]}), default`
    : "default";

  canvas.style.cursor = cursorStyle;
}