export const ExtractExpectedCounts = (code) => {
  const expectedCounts = [];

  // 1. Find each scanf's format string
  const scanfMatches = [...code.matchAll(/scanf\s*\(\s*"(.*?)"/g)];
  const valueCounts = scanfMatches.map((m) => {
    const formatStr = m[1];
    return (formatStr.match(/%[dfcs]/g) || []).length;
  });

  // 2. Detect the variable names used for dimensions
  let rowsVar = null, colsVar = null;
  const dimensionMatch = code.match(/scanf\s*\(\s*"%d\s*%d"\s*,\s*&(\w+)\s*,\s*&(\w+)/);
  if (dimensionMatch) {
    rowsVar = dimensionMatch[1];
    colsVar = dimensionMatch[2];
  }

  // Default matrix size in case we can't extract dimensions
  let matrixSize = 6;

  // 3. Attempt to statically detect rows * cols value
  const rowAssign = code.match(new RegExp(`int\\s+${rowsVar}\\s*=\\s*(\\d+)`));
  const colAssign = code.match(new RegExp(`int\\s+${colsVar}\\s*=\\s*(\\d+)`));
  if (rowAssign && colAssign) {
    matrixSize = parseInt(rowAssign[1]) * parseInt(colAssign[1]);
  }

  // 4. Build counts: initial inputs + matrix a + matrix b
  expectedCounts.push(valueCounts[0] || 2); // e.g., rows & cols
  expectedCounts.push(matrixSize); // matrix A
  expectedCounts.push(matrixSize); // matrix B

  return expectedCounts;
};
