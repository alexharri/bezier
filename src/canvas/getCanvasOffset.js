const canvas = document.getElementById("canvas");
const getCanvasRect = () => canvas.getBoundingClientRect();

exports.getLeftOffset = () => getCanvasRect().left;
exports.getTopOffset  = () => getCanvasRect().top;
