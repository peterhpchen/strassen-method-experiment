function matrixMultiplicationSimple(
  n: number,
  m: number,
  p: number,
  matrix1: number[][],
  matrix2: number[][]
) {
  const result = [...Array(n)].map(() => Array(p).fill(0)); // [n][p]
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < p; k++) {
      let ik = 0;
      for (let j = 0; j < m; j++) {
        ik += matrix1[i][j] * matrix2[j][k];
      }
      result[i][k] = ik;
    }
  }
  return result;
}

function matrixMultiplicationStrassen(
  n: number,
  m: number,
  p: number,
  matrix1: number[][],
  matrix2: number[][],
  threshold?: number
) {
  if (n === 1 && m === 1 && p === 1) return [[matrix1[0][0] * matrix2[0][0]]];
  const currentN = n > p ? (n % 2 === 0 ? n : n + 1) : p % 2 === 0 ? p : p + 1;
  if (threshold >= currentN)
    return matrixMultiplicationSimple(n, m, p, matrix1, matrix2);
  const result = [...Array(currentN)].map(() => Array(currentN).fill(0));
  const matrix1Square = [...Array(currentN)].map((_, i) =>
    [...Array(currentN)].map((_, j) => (i < n && j < m ? matrix1[i][j] : 0))
  );
  const matrix2Square = [...Array(currentN)].map((_, j) =>
    [...Array(currentN)].map((_, k) => (j < m && k < p ? matrix2[j][k] : 0))
  );
  const nextN = currentN / 2;
 
const a11 = [];
  // const a12 = [];
  // const a21 = [];
  const a22 = [];
  const b11 = [];
  // const b12 = [];
  // const b21 = [];
  const b22 = [];
  const a11PlusA22 = [];
  const b11PlusB22 = [];
  const a21PlusA22 = [];
  const b12MinusB22 = [];
  const b21MinusB11 = [];
  const a11PlusA12 = [];
  const a21MinusA11 = [];
  const b11PlusB12 = [];
  const a12MinusA22 = [];
  const b21PlusB22 = [];
  for (let i = 0; i < nextN; i++) {
    a11.push([]);
    a22.push([]);
    b11.push([]);
    b22.push([]);
    a11PlusA22.push([]);
    b11PlusB22.push([]);
    a21PlusA22.push([]);
    b12MinusB22.push([]);
    b21MinusB11.push([]);
    a11PlusA12.push([]);
    a21MinusA11.push([]);
    b11PlusB12.push([]);
    a12MinusA22.push([]);
    b21PlusB22.push([]);
    const matrix1Squarei = matrix1Square[i];
    const matrix2Squarei = matrix2Square[i];
    const matrix1SquareinextN = matrix1Square[i + nextN];
    const matrix2SquareinextN = matrix2Square[i + nextN];
    for (let j = 0; j < nextN; j++) {
      a11[i].push(matrix1Squarei[j]);
      const a12ij = matrix1Squarei[j + nextN]
      const a21ij = matrix1SquareinextN[j]
      a22[i].push(matrix1SquareinextN[j + nextN]);
      b11[i].push(matrix2Squarei[j]);
      const b12ij = matrix2Squarei[j + nextN]
      const b21ij = matrix2SquareinextN[j]
      b22[i].push(matrix2SquareinextN[j + nextN]);
      a11PlusA22[i].push(a11[i][j] + a22[i][j]);
      b11PlusB22[i].push(b11[i][j] + b22[i][j]);
      a21PlusA22[i].push(a21ij + a22[i][j]);
      b12MinusB22[i].push(b12ij - b22[i][j]);
      b21MinusB11[i].push(b21ij - b11[i][j]);
      a11PlusA12[i].push(a11[i][j] + a12ij);
      a21MinusA11[i].push(a21ij - a11[i][j]);
      b11PlusB12[i].push(b11[i][j] + b12ij);
      a12MinusA22[i].push(a12ij - a22[i][j]);
      b21PlusB22[i].push(b21ij + b22[i][j]);
    }
  }

  let m1 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a11PlusA22,
    b11PlusB22
  );
  let m2 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a21PlusA22,
    b11,
    threshold || 0
  );
  let m3 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a11,
    b12MinusB22,
    threshold || 0
  );
  let m4 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a22,
    b21MinusB11,
    threshold || 0
  );
  let m5 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a11PlusA12,
    b22,
    threshold || 0
  );
  let m6 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a21MinusA11,
    b11PlusB12
  );
  let m7 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a12MinusA22,
    b21PlusB22
  );

  for (let i = 0; i < nextN; i++) {
    const m1i = m1[i];
    const m2i = m2[i];
    const m3i = m3[i];
    const m4i = m4[i];
    const m5i = m5[i];
    const m6i = m6[i];
    const m7i = m7[i];
    for (let j = 0; j < nextN; j++) {
      result[i][j] = m1i[j] + m4i[j] - m5i[j] + m7i[j];
      result[i][j + nextN] = m3i[j] + m5i[j];
      result[i + nextN][j] = m2i[j] + m4i[j];
      result[i + nextN][j + nextN] = m1i[j] + m3i[j] - m2i[j] + m6i[j];
    }
  }
  return result.slice(0, n).map((val) => val.slice(0, p));
}

export { matrixMultiplicationSimple, matrixMultiplicationStrassen };
