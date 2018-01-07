const shortid = require("shortid");
const { cursors } = require("../constants");

const canvas = document.getElementById("canvas");
const cursorImageMap = {};

{
  const keys = Object.keys(cursors);
  for (let i = 0; i < keys.length; i += 1) {
    const image = new Image();
    image.src = `/static/images/${cursors[keys[i]]}`;
    cursorImageMap[keys[i]] = image;
  }
}

let currentCursor = "DEFAULT";
let override = null;

/**
 * Changes the cursor on canvas hover.
 *
 * You can set override to true in the opts object to ensure
 * that no other part of the application changes the cursor.
 *
 * Override being active means that the cursor cannot be changed
 * unless the correct overrideId is provided in the options object.
 *
 * The overrideId is returned when overriding.
 */
exports.setCursor = function setCursor(cursor, opts = {}) {
  if (!opts || typeof opts !== "object") {
    throw new Error(`Invalid options. Expected object but got '${opts}'.`);
  }

  if (override && opts.overrideId !== override) {
    return false;
  }

  if (typeof cursors[cursor] === "undefined") {
    throw new Error(`Invalid cursor '${cursor}'.`);
  }

  if (cursor === currentCursor) {
    return;
  }

  currentCursor = cursor;
  let cursorStyle = `url(/static/images/${cursors[cursor]}), default`;

  // canvas.style.cursor = cursorStyle;

  if (opts.override) {
    override = shortid();
    return override;
  }

  return true;
}

exports.getCursor = function getCursor() {
  return cursorImageMap[currentCursor];
}

exports.releaseOverride = function releaseOverride(id) {
  if (override === null) {
    throw new Error("No override is present.");
  }

  if (id !== override) {
    throw new Error(`Incorrect overrideId. Expected '${override}' but got '${id}'.`);
  }

  override = null;
}
