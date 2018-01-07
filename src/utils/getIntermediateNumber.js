/**
 * a and b are any numbers.
 * t should be a number between 0 and 1
 */
const getIntermediateNumber = (a, b, t) => (a * (1 - t)) + (b * t);

module.exports = getIntermediateNumber;
