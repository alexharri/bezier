module.exports = {
  colors: {
    PRIMARY:          "#29aaf4",
    PRIMARY_LIGHT:    "#68bef2",
    PRIMARY_LIGHTER:  "#c4e9ff",
    WHITE: "#fff",
  },

  types: {
    POINT: "__POINT",
    CONN: "__CONNECTION",
    HANDLE: "__HANDLE",
  },

  tools: {
    /**
     * lowercase letters will be included with the string keys
     */
    p:    "PEN",
    PEN:  "PEN",

    v:    "MOVE",
    MOVE: "MOVE",
  },

  cursors: {
    // Common cursors
    DEFAULT: "default-cursor.png",
    MOVE: "default-move-cursor.png",

    // Pen cursors
    PEN: "pen-cursor.png",
    PEN_ADD_POINT: "pen-add-point-cursor.png",
    PEN_SELECT_POINT: "pen-select-point-cursor.png",
    CONVERT_ANCHOR_POINT: "convert-anchor-point-cursor.png",
  },

  /**
   * Given any tool, this should return it's default cursor.
   * (cursor when no object is in the interaction range of 15px)
   */
  defaultToolCursors: {
    MOVE: "DEFAULT",
    PEN: "PEN",
  },

  keys: {
    SHIFT: "Shift",
    CONTROL: "Control",
    ALT: "Alt",
    ARROW_UP:     "ArrowUp",
    ARROW_LEFT:   "ArrowLeft",
    ARROW_DOWN:   "ArrowDown",
    ARROW_RIGHT:  "ArrowRight",
  },
};
