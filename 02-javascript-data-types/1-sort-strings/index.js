/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
   const arrCopy = [...arr];

   if (!arrCopy.length) return arrCopy;
   
   if (param === 'asc') { 
      return arrCopy.sort((firstString, secondString) => firstString.localeCompare(secondString, ['ru', 'en'], { caseFirst: 'upper' }));
   }

   return arrCopy.sort((firstString, secondString) => secondString.localeCompare(firstString, ['ru', 'en'], { caseFirst: 'upper' }));
}
