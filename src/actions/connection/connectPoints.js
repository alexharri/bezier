module.exports = function connectPoints({
  connection,
  handles,
  strayConnection,
  strayConnectionHandle
}) {
  const actions = [];

  actions.push({
    type: "ADD_CONNECTION",
    data: connection,
  });

  if (handles) {
    actions.push({
      type: "ADD_HANDLES",
      data: handles,
    });
  }

  if (strayConnection) {
    actions.push({
      type: "ADD_CONNECTION",
      data: strayConnection,
    });
    actions.push({
      type: "ADD_HANDLES",
      data: [strayConnectionHandle],
    });
  }

  return actions;
}