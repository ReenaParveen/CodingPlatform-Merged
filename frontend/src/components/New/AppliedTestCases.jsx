// programs.js
const programs = [
    {
      name: "Factorial (Recursion)",
      testCases: [
        { input: "5\n", expectedOutput: "120\n" },
        { input: "0\n", expectedOutput: "1\n" },
        { input: "1\n", expectedOutput: "1\n" },
        { input: "10\n", expectedOutput: "3628800\n" },
      ],
    },
    {
      name: "Prime Check",
      testCases: [
        { input: "2\n", expectedOutput: "True\n" },
        { input: "4\n", expectedOutput: "False\n" },
        { input: "17\n", expectedOutput: "True\n" },
        { input: "0\n", expectedOutput: "False\n" },
        { input: "-5\n", expectedOutput: "False\n" },
      ],
    },
    {
      name: "Fibonacci Series (Nth Term)",
      testCases: [
        { input: "5\n", expectedOutput: "5\n" },
        { input: "10\n", expectedOutput: "55\n" },
        { input: "0\n", expectedOutput: "0\n" },
        { input: "1\n", expectedOutput: "1\n" },
      ],
    },
    {
      name: "Sum of Digits",
      testCases: [
        { input: "123\n", expectedOutput: "6\n" },
        { input: "0\n", expectedOutput: "0\n" },
        { input: "-456\n", expectedOutput: "15\n" },
      ],
    },
    {
      name: "GCD Calculation",
      testCases: [
        { input: "54\n24\n", expectedOutput: "6\n" },
        { input: "0\n5\n", expectedOutput: "5\n" },
        { input: "0\n0\n", expectedOutput: "0\n" },
        { input: "-20\n5\n", expectedOutput: "5\n" },
      ],
    },
    {
      name: "Palindrome Check",
      testCases: [
        { input: "Madam\n", expectedOutput: "True\n" },
        { input: "racecar\n", expectedOutput: "True\n" },
        { input: "hello\n", expectedOutput: "False\n" },
        { input: "A man a plan a canal Panama\n", expectedOutput: "True\n" },
      ],
    },
    {
      name: "Find Max in List",
      testCases: [
        { input: "1 2 3 4 5\n", expectedOutput: "5\n" },
        { input: "-1 -2 -3 -4\n", expectedOutput: "-1\n" },
        { input: "0 0 0 0\n", expectedOutput: "0\n" },
      ],
    },
    {
      name: "Reverse a Number",
      testCases: [
        { input: "1234\n", expectedOutput: "4321\n" },
        { input: "-5678\n", expectedOutput: "-8765\n" },
        { input: "0\n", expectedOutput: "0\n" },
      ],
    },
    {
      name: "Count Vowels",
      testCases: [
        { input: "hello\n", expectedOutput: "2\n" },
        { input: "AEIOU\n", expectedOutput: "5\n" },
        { input: "xyz\n", expectedOutput: "0\n" },
      ],
    },
    {
      name: "Armstrong Number Check",
      testCases: [
        { input: "153\n", expectedOutput: "True\n" },
        { input: "9474\n", expectedOutput: "True\n" },
        { input: "10\n", expectedOutput: "False\n" },
        { input: "0\n", expectedOutput: "True\n" },
      ],
    },
  ];
  
  export default programs;
  