// TestCaseResults.jsx
import React, { useState } from 'react';

const TestCaseResults = ({ selectedProgram }) => {
  const [testResult, setTestResult] = useState(null);

  const runTestCases = () => {
    const results = selectedProgram.testCases.map((testCase, index) => {
      // Simulate running the test case
      // In a real scenario, you could run code here or mock the result
      const output = testCase.expectedOutput; // Mocking output for now

      return (
        <div key={index}>
          <p>Test Case {index + 1}:</p>
          <p>Input: {testCase.input}</p>
          <p>Expected Output: {testCase.expectedOutput}</p>
          <p>Test Result: {output === testCase.expectedOutput ? "Passed" : "Failed"}</p>
        </div>
      );
    });

    setTestResult(results);
  };

  return (
    <div>
      <button onClick={runTestCases}>Run Test Cases</button>
      <div>
        {testResult ? (
          <div>
            <h2>Test Results:</h2>
            {testResult}
          </div>
        ) : (
          <p>No test cases run yet</p>
        )}
      </div>
    </div>
  );
};

export default TestCaseResults;
