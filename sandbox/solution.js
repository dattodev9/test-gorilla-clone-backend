/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    // Begin coding
 s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0;
    let right = s.length - 1;

    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;    
    // End coding
};

module.exports = isPalindrome;