/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
   let keyIndex = -1;
   const keys = path.split('.');

   return function getValue(value) {
      keyIndex++;

      return typeof value !== 'object' ? value : getValue(value[keys[keyIndex]]);
   };
}