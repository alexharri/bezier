const invalidConnection = () => { throw new Error("Invalid connection."); }
const invalidIdArray = () => { throw new Error("Invalid id array."); }

function checkIdArray(idArr, length = 2) {
  if (idArr.length !== length) {
    invalidIdArray();
  }

  for (let i = 0; i < idArr.length; i += 1) {
    // Checking for objects
   if (idArr[i] && typeof idArr[i] === "object") {
     invalidIdArray();
   }

   // All ids should be a string or null.
   if (typeof idArr[i] !== "string" && typeof idArr[i] !== "object") { 
     invalidIdArray();
   }
 }
}
exports.checkIdArray = checkIdArray;

/**
 * This is not extensive, but should catch most errors.
 */
exports.checkValidConnection = function checkValidConnection({ id, points, handles }) {
  if (!id || typeof id !== "string") {
    invalidConnection();
  }

  if (!Array.isArray(points) || !Array.isArray(handles)) {
    invalidConnection();
  }

  // The first point must always be present
  if (!points[0]) {
    invalidConnection();
  }

  /**
   * If the second point is not present, a handle must be present
   * for the first point.
   */
  if (!points[1] && !handles[0]) {
    invalidConnection();
  }

  checkIdArray([
    ...points,
    ...handles,
  ], 4);
}
