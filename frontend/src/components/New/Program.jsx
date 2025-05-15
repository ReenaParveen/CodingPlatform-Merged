// // components/programs.js

// const program = [
//   {
//     id: 1,
//     title: "Addition of Two Numbers",
//     code: `a = int(input("Enter a: "))
// b = int(input("Enter b: "))
// print(a + b)`,
//     testCases: [
//       { input: "2\n3", expectedOutput: "5\n" },
//       { input: "10\n20", expectedOutput: "30\n" },
//     ],
//   },
//   {
//     id: 2,
//     title: "Factorial of a Number",
//     code: `n = int(input("Enter n: "))
// fact = 1
// for i in range(1, n + 1):
//     fact *= i
// print(fact)`,
//     testCases: [
//       { input: "5", expectedOutput: "120\n" },
//       { input: "3", expectedOutput: "6\n" },
//     ],
//   },
//   {
//     id: 3,
//     title: "Check Even or Odd",
//     code: `n = int(input("Enter n: "))
// if n % 2 == 0:
//     print("Even")
// else:
//     print("Odd")`,
//     testCases: [
//       { input: "4", expectedOutput: "Even\n" },
//       { input: "7", expectedOutput: "Odd\n" },
//     ],
//   },
//   {
//     id: 4,
//     title: "Find Maximum of Two Numbers",
//     code: `a = int(input("Enter a: "))
// b = int(input("Enter b: "))
// print(max(a, b))`,
//     testCases: [
//       { input: "4\n7", expectedOutput: "7\n" },
//       { input: "10\n2", expectedOutput: "10\n" },
//     ],
//   },
//   {
//     id: 5,
//     title: "Sum of N Natural Numbers",
//     code: `n = int(input("Enter n: "))
// print(n * (n + 1) // 2)`,
//     testCases: [
//       { input: "5", expectedOutput: "15\n" },
//       { input: "100", expectedOutput: "5050\n" },
//     ],
//   },
//   {
//     id: 6,
//     title: "Reverse a String",
//     code: `s = input("Enter string: ")
// print(s[::-1])`,
//     testCases: [
//       { input: "hello", expectedOutput: "olleh\n" },
//       { input: "Reena", expectedOutput: "aneeR\n" },
//     ],
//   },
//   {
//     id: 7,
//     title: "Check Prime Number",
//     code: `n = int(input("Enter n: "))
// is_prime = n > 1 and all(n % i != 0 for i in range(2, int(n**0.5)+1))
// print("Prime" if is_prime else "Not Prime")`,
//     testCases: [
//       { input: "5", expectedOutput: "Prime\n" },
//       { input: "6", expectedOutput: "Not Prime\n" },
//     ],
//   },
//   {
//     id: 8,
//     title: "Fibonacci Sequence (n terms)",
//     code: `n = int(input("Enter n: "))
// a, b = 0, 1
// for _ in range(n):
//     print(a, end=' ')
//     a, b = b, a + b
// print()`,
//     testCases: [
//       { input: "5", expectedOutput: "0 1 1 2 3 \n" },
//       { input: "3", expectedOutput: "0 1 1 \n" },
//     ],
//   },
//   {
//     id: 9,
//     title: "Count Vowels in a String",
//     code: `s = input("Enter string: ")
// vowels = 'aeiouAEIOU'
// count = sum(1 for c in s if c in vowels)
// print(count)`,
//     testCases: [
//       { input: "hello", expectedOutput: "2\n" },
//       { input: "REENA", expectedOutput: "3\n" },
//     ],
//   },
//   {
//     id: 10,
//     title: "Find GCD of Two Numbers",
//     code: `import math
// a = int(input("Enter a: "))
// b = int(input("Enter b: "))
// print(math.gcd(a, b))`,
//     testCases: [
//       { input: "8\n12", expectedOutput: "4\n" },
//       { input: "15\n20", expectedOutput: "5\n" },
//     ],
//   },
// ];

// export default program;

// components/programs.js

const programs = [
  {
    id: 1,
    title: "Addition of Two Numbers",
    code: `a = int(input("Enter a: "))
b = int(input("Enter b: "))
print(a + b)`,
    testCases: [
      { input: "2\n3", expectedOutput: "5\n" },
      { input: "10\n20", expectedOutput: "30\n" },
      { input: "0\n0", expectedOutput: "0\n" },
      { input: "-5\n5", expectedOutput: "0\n" },
      { input: "-10\n-20", expectedOutput: "-30\n" },
      { input: "100\n200", expectedOutput: "300\n" },
      { input: "999\n1", expectedOutput: "1000\n" },
      { input: "7\n8", expectedOutput: "15\n" },
      { input: "123\n321", expectedOutput: "444\n" },
      { input: "50\n-25", expectedOutput: "25\n" },
    ],
  },
  {
    id: 2,
    title: "Factorial of a Number",
    code: `n = int(input("Enter n: "))
fact = 1
for i in range(1, n + 1):
    fact *= i
print(fact)`,
    testCases: [
      { input: "5", expectedOutput: "120\n" },
      { input: "3", expectedOutput: "6\n" },
      { input: "0", expectedOutput: "1\n" },
      { input: "1", expectedOutput: "1\n" },
      { input: "6", expectedOutput: "720\n" },
      { input: "7", expectedOutput: "5040\n" },
      { input: "8", expectedOutput: "40320\n" },
      { input: "2", expectedOutput: "2\n" },
      { input: "4", expectedOutput: "24\n" },
      { input: "10", expectedOutput: "3628800\n" },
    ],
  },
  {
    id: 3,
    title: "Check Even or Odd",
    code: `n = int(input("Enter n: "))
if n % 2 == 0:
    print("Even")
else:
    print("Odd")`,
    testCases: [
      { input: "4", expectedOutput: "Even\n" },
      { input: "7", expectedOutput: "Odd\n" },
      { input: "0", expectedOutput: "Even\n" },
      { input: "-2", expectedOutput: "Even\n" },
      { input: "-3", expectedOutput: "Odd\n" },
      { input: "100", expectedOutput: "Even\n" },
      { input: "101", expectedOutput: "Odd\n" },
      { input: "999", expectedOutput: "Odd\n" },
      { input: "888", expectedOutput: "Even\n" },
      { input: "-101", expectedOutput: "Odd\n" },
    ],
  },
  {
    id: 4,
    title: "Find Maximum of Two Numbers",
    code: `a = int(input("Enter a: "))
b = int(input("Enter b: "))
print(max(a, b))`,
    testCases: [
      { input: "4\n7", expectedOutput: "7\n" },
      { input: "10\n2", expectedOutput: "10\n" },
      { input: "0\n0", expectedOutput: "0\n" },
      { input: "-5\n5", expectedOutput: "5\n" },
      { input: "-10\n-20", expectedOutput: "-10\n" },
      { input: "100\n50", expectedOutput: "100\n" },
      { input: "999\n1000", expectedOutput: "1000\n" },
      { input: "8\n8", expectedOutput: "8\n" },
      { input: "123\n321", expectedOutput: "321\n" },
      { input: "50\n-25", expectedOutput: "50\n" },
    ],
  },
  {
    id: 5,
    title: "Sum of N Natural Numbers",
    code: `n = int(input("Enter n: "))
print(n * (n + 1) // 2)`,
    testCases: [
      { input: "5", expectedOutput: "15\n" },
      { input: "100", expectedOutput: "5050\n" },
      { input: "0", expectedOutput: "0\n" },
      { input: "1", expectedOutput: "1\n" },
      { input: "10", expectedOutput: "55\n" },
      { input: "50", expectedOutput: "1275\n" },
      { input: "7", expectedOutput: "28\n" },
      { input: "20", expectedOutput: "210\n" },
      { input: "15", expectedOutput: "120\n" },
      { input: "25", expectedOutput: "325\n" },
    ],
  },
  {
    id: 6,
    title: "Reverse a String",
    code: `s = input("Enter string: ")
print(s[::-1])`,
    testCases: [
      { input: "hello", expectedOutput: "olleh\n" },
      { input: "Reena", expectedOutput: "aneeR\n" },
      { input: "abc", expectedOutput: "cba\n" },
      { input: "madam", expectedOutput: "madam\n" },
      { input: "Python", expectedOutput: "nohtyP\n" },
      { input: "OpenAI", expectedOutput: "IAnepO\n" },
      { input: "racecar", expectedOutput: "racecar\n" },
      { input: "12345", expectedOutput: "54321\n" },
      { input: "wow", expectedOutput: "wow\n" },
      { input: "a", expectedOutput: "a\n" },
    ],
  },
  {
    id: 7,
    title: "Check Prime Number",
    code: `n = int(input("Enter n: "))
is_prime = n > 1 and all(n % i != 0 for i in range(2, int(n**0.5)+1))
print("Prime" if is_prime else "Not Prime")`,
    testCases: [
      { input: "5", expectedOutput: "Prime\n" },
      { input: "6", expectedOutput: "Not Prime\n" },
      { input: "2", expectedOutput: "Prime\n" },
      { input: "3", expectedOutput: "Prime\n" },
      { input: "4", expectedOutput: "Not Prime\n" },
      { input: "7", expectedOutput: "Prime\n" },
      { input: "9", expectedOutput: "Not Prime\n" },
      { input: "11", expectedOutput: "Prime\n" },
      { input: "1", expectedOutput: "Not Prime\n" },
      { input: "13", expectedOutput: "Prime\n" },
    ],
  },
  {
    id: 8,
    title: "Fibonacci Sequence (n terms)",
    code: `n = int(input("Enter n: "))
a, b = 0, 1
for _ in range(n):
    print(a, end=' ')
    a, b = b, a + b
print()`,
    testCases: [
      { input: "5", expectedOutput: "0 1 1 2 3 \n" },
      { input: "3", expectedOutput: "0 1 1 \n" },
      { input: "1", expectedOutput: "0 \n" },
      { input: "2", expectedOutput: "0 1 \n" },
      { input: "6", expectedOutput: "0 1 1 2 3 5 \n" },
      { input: "7", expectedOutput: "0 1 1 2 3 5 8 \n" },
      { input: "8", expectedOutput: "0 1 1 2 3 5 8 13 \n" },
      { input: "4", expectedOutput: "0 1 1 2 \n" },
      { input: "9", expectedOutput: "0 1 1 2 3 5 8 13 21 \n" },
      { input: "10", expectedOutput: "0 1 1 2 3 5 8 13 21 34 \n" },
    ],
  },
  {
    id: 9,
    title: "Count Vowels in a String",
    code: `s = input("Enter string: ")
vowels = 'aeiouAEIOU'
count = sum(1 for c in s if c in vowels)
print(count)`,
    testCases: [
      { input: "hello", expectedOutput: "2\n" },
      { input: "REENA", expectedOutput: "3\n" },
      { input: "bcd", expectedOutput: "0\n" },
      { input: "aeiou", expectedOutput: "5\n" },
      { input: "AEIOU", expectedOutput: "5\n" },
      { input: "python", expectedOutput: "1\n" },
      { input: "OpenAI", expectedOutput: "4\n" },
      { input: "madam", expectedOutput: "2\n" },
      { input: "wow", expectedOutput: "1\n" },
      { input: "xyz", expectedOutput: "0\n" },
    ],
  },
  {
    id: 10,
    title: "Find GCD of Two Numbers",
    code: `import math
a = int(input("Enter a: "))
b = int(input("Enter b: "))
print(math.gcd(a, b))`,
    testCases: [
      { input: "8\n12", expectedOutput: "4\n" },
      { input: "15\n20", expectedOutput: "5\n" },
      { input: "100\n10", expectedOutput: "10\n" },
      { input: "7\n13", expectedOutput: "1\n" },
      { input: "81\n27", expectedOutput: "27\n" },
      { input: "14\n28", expectedOutput: "14\n" },
      { input: "9\n6", expectedOutput: "3\n" },
      { input: "18\n24", expectedOutput: "6\n" },
      { input: "101\n103", expectedOutput: "1\n" },
      { input: "42\n56", expectedOutput: "14\n" },
    ],
  },
];

export default programs;
