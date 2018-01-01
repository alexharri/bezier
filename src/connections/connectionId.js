const toConnectionId = (a, b) => ([a, b].sort().join("-"));

exports.toConnectionId = toConnectionId;
