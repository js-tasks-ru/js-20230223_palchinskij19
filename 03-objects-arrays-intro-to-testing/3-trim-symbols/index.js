/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
   let resultingString = '';
   let i = 0;
   // const frequencyCounter = {};

   if (!string || size === 0) return resultingString;

   if (size === undefined) return string;

   for (let j = 0; j < string.length; j++) {
      
      
   }

   // for (const symbol of string) {
   //    if (!frequencyCounter[symbol]) {
   //       frequencyCounter[symbol] = 0; 
   //    }

   //    if (frequencyCounter[symbol] <= size - 1) {
   //       frequencyCounter[symbol] = frequencyCounter[symbol] + 1; 
   //    }
   // }
   // for (const [symbol, count] of Object.entries(frequencyCounter)) {
   //    resultingString += symbol.repeat(count);
   // }

   return resultingString;
}
