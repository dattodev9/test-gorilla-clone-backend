/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
  // Begin code
  const merged = [...nums1, ...nums2].sort((a, b) => a - b);
  const len = merged.length;
  
  // Find median
  if (len % 2 === 0) {
    // Even length: average of two middle elements
    return (merged[len / 2 - 1] + merged[len / 2]) / 2;
  } else {
    // Odd length: middle element
    return merged[Math.floor(len / 2)];
  }
  // End code
};

module.exports = findMedianSortedArrays;