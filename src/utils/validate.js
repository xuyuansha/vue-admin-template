/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return /^[A-Za-z_@.]\w{3,20}$/.test(str)
}

export function isvalidPass(str) {
  const reg = /^\w{6,18}$/
  return reg.test(str)
}
