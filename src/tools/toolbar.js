const { setTool } = require("./tools");

const tools = [
  {
    icon: "default-cursor.png",
    toolKey: "v",
    id: "movetool",
    position: {
      x: 7,
      y: 7,
    },
  },
  {
    icon: "pen-cursor.png",
    toolKey: "p",
    id: "pentool",
    position: {
      x: 7,
      y: 7,
    },
  },
];

module.exports = function createToolBar() {
  const toolElements = tools.map(({ icon, toolKey, id, position }) => {
    const toolEl = document.createElement("BUTTON");
    toolEl.classList.add("tool");
    toolEl.id = id;
    toolEl.style.backgroundImage = `url("static/images/${icon}")`;
    toolEl.style.backgroundPositionX = `${position.x}px`;
    toolEl.style.backgroundPositionY = `${position.y}px`;
    toolEl.setAttribute("data-tool-key", toolKey);

    if (id === "movetool") {
      toolEl.classList.add("active");
    }

    toolEl.onclick = () => setTool(toolKey);
    return toolEl;
  });

  toolElements.forEach((toolEl) => {
    document.getElementById("toolbar").appendChild(toolEl);
  });
}