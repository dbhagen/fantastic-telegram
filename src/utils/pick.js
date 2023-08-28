/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign, security/detect-object-injection
      obj[key] = object[key] // FIXME(Daniel Hagen): Look into security concern?
    }
    return obj
  }, {})
}

module.exports = pick
