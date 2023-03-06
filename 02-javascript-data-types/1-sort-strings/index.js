/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
const compareStrings = (firstString, secondString) => firstString.localeCompare(secondString, ['ru', 'en'], { caseFirst: 'upper' });

export function sortStrings(arr, param = 'asc') {
   if (!arr.length) return arr;
   
   return [...arr].sort((firstString, secondString) => {
      if (param === 'asc') {
         return compareStrings(firstString, secondString);
      }

      if (param === 'desc') {
         return compareStrings(secondString, firstString);
      }
   });
}
