const mainContainer = document.getElementById("main-container");
const getMainRect = () => mainContainer.getBoundingClientRect();

exports.getLeftOffset = () => getMainRect().left;
exports.getTopOffset  = () => getMainRect().top;
