const category = {
  arrays_and_hashing: "arrays-and-hashing",
  two_pointers: "two-pointers",
  sliding_window: "sliding-window",
};

const difficulty = {
  easy: "EASY",
  med: "MEDIUM",
  hard: "HARD",
};

const generateProblemObj = (name, url, difficulty, cat) => {
  return {
    name: name,
    leetcode_url: url,
    difficulty: difficulty,
    categories: [{ name: cat }],
  };
};

const arrays_and_hashing = [
  generateProblemObj(
    "Contains Duplicate",
    "https://leetcode.com/problems/contains-duplicate/",
    difficulty.easy,
    category.arrays_and_hashing
  ),
  generateProblemObj(
    "Valid Anagram",
    "https://leetcode.com/problems/valid-anagram/",
    difficulty.easy,
    category.arrays_and_hashing
  ),
  generateProblemObj(
    "Two Sum",
    "https://leetcode.com/problems/two-sum/",
    difficulty.easy,
    category.arrays_and_hashing
  ),
  generateProblemObj(
    "Group Anagrams",
    "https://leetcode.com/problems/group-anagrams/",
    difficulty.med,
    category.arrays_and_hashing
  ),
  generateProblemObj(
    "Top K Frequent Elements",
    "https://leetcode.com/problems/top-k-frequent-elements/",
    difficulty.med,
    category.arrays_and_hashing
  ),
  generateProblemObj(
    "Encode and Decode Strings",
    "https://leetcode.com/problems/encode-and-decode-strings/",
    difficulty.med,
    category.arrays_and_hashing
  ),
  generateProblemObj(
    "Product of Array Except Self",
    "https://leetcode.com/problems/product-of-array-except-self/",
    difficulty.med,
    category.arrays_and_hashing
  ),
  generateProblemObj(
    "Valid Sodoku",
    "https://leetcode.com/problems/valid-sudoku/",
    difficulty.med,
    category.arrays_and_hashing
  ),
  generateProblemObj(
    "Longest Consecutive Sequence",
    "https://leetcode.com/problems/longest-consecutive-sequence/",
    difficulty.med,
    category.arrays_and_hashing
  ),
];

const two_pointers = [
  generateProblemObj(
    "Valid Palindrome",
    "https://leetcode.com/problems/valid-palindrome/",
    difficulty.easy,
    category.two_pointers
  ),
  generateProblemObj(
    "Two Sum II Input Array Is Sorted",
    "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    difficulty.med,
    category.two_pointers
  ),
  generateProblemObj(
    "3Sum",
    "https://leetcode.com/problems/3sum/",
    difficulty.med,
    category.two_pointers
  ),
  generateProblemObj(
    "Container With Most Water",
    "https://leetcode.com/problems/container-with-most-water/",
    difficulty.med,
    category.two_pointers
  ),
  generateProblemObj(
    "Trapping Rain Water",
    "https://leetcode.com/problems/trapping-rain-water/",
    difficulty.hard,
    category.two_pointers
  ),
];

const sliding_window = [
  generateProblemObj(
    "Best Time to Buy And Sell Stock",
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    difficulty.easy,
    category.sliding_window
  ),
  generateProblemObj(
    "Longest Substring Without Repeating Characters",
    "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    difficulty.med,
    category.sliding_window
  ),
  generateProblemObj(
    "Longest Repeating Character Replacement",
    "https://leetcode.com/problems/longest-repeating-character-replacement/",
    difficulty.med,
    category.sliding_window
  ),
  generateProblemObj(
    "Permutation In String",
    "https://leetcode.com/problems/permutation-in-string/",
    difficulty.med,
    category.sliding_window
  ),
  generateProblemObj(
    "Minimum Window Substring",
    "https://leetcode.com/problems/minimum-window-substring/",
    difficulty.hard,
    category.sliding_window
  ),
  generateProblemObj(
    "Sliding Window Maximum",
    "https://leetcode.com/problems/sliding-window-maximum/",
    difficulty.hard,
    category.sliding_window
  ),
];

const problems = [].concat(arrays_and_hashing, two_pointers, sliding_window);

problems.forEach((problem) => {
  pm.sendRequest(
    {
      url: pm.environment.get("host") + "/problems/",
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: {
        mode: "raw",
        raw: JSON.stringify(problem),
      },
    },
    function (err, res) {
      if (err) {
        console.log(`Error submitting ${problem.name}: ${err}`);
      } else if (res.status !== 201) {
        console.log(`Error submitting ${problem.name}: ${res.status}`);
        console.log(res.text());
      } else {
        console.log(`${problem.name} submitted successfully`);
      }
    }
  );
});
