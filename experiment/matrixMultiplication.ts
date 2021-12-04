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
 
  const a11 = matrix1Square.slice(0, nextN).map((val) => val.slice(0, nextN));
  const a12 = matrix1Square.slice(0, nextN).map((val) => val.slice(nextN));
  const a21 = matrix1Square.slice(nextN).map((val) => val.slice(0, nextN));
  const a22 = matrix1Square.slice(nextN).map((val) => val.slice(nextN));
  const b11 = matrix2Square.slice(0, nextN).map((val) => val.slice(0, nextN));
  const b12 = matrix2Square.slice(0, nextN).map((val) => val.slice(nextN));
  const b21 = matrix2Square.slice(nextN).map((val) => val.slice(0, nextN));
  const b22 = matrix2Square.slice(nextN).map((val) => val.slice(nextN));
  let a11PlusA22 = [...Array(nextN)].map(() => Array(nextN).fill(0));
  let b11PlusB22 = [...Array(nextN)].map(() => Array(nextN).fill(0));
  let a21PlusA22 = [...Array(nextN)].map(() => Array(nextN).fill(0));
  let b12MinusB22 = [...Array(nextN)].map(() => Array(nextN).fill(0));
  let b21MinusB11 = [...Array(nextN)].map(() => Array(nextN).fill(0));
  let a11PlusA12 = [...Array(nextN)].map(() => Array(nextN).fill(0));
  let a21MinusA11 = [...Array(nextN)].map(() => Array(nextN).fill(0));
  let b11PlusB12 = [...Array(nextN)].map(() => Array(nextN).fill(0));
  let a12MinusA22 = [...Array(nextN)].map(() => Array(nextN).fill(0));
  let b21PlusB22 = [...Array(nextN)].map(() => Array(nextN).fill(0));
  for (let i = 0; i < nextN; i++) {
    const a11i = a11[i]
    const a12i = a12[i]
    const a21i = a21[i]
    const a22i = a22[i]
    const b11i = b11[i]
    const b12i = b12[i]
    const b21i = b21[i]
    const b22i = b22[i]
    for (let j = 0; j < nextN; j++) {
      a11PlusA22[i][j] = a11i[j] + a22i[j];
      b11PlusB22[i][j] = b11i[j] + b22i[j];
      a21PlusA22[i][j] = a21i[j] + a22i[j];
      b12MinusB22[i][j] = b12i[j] - b22i[j];
      b21MinusB11[i][j] = b21i[j] - b11i[j];
      a11PlusA12[i][j] = a11i[j] + a12i[j];
      a21MinusA11[i][j] = a21i[j] - a11i[j];
      b11PlusB12[i][j] = b11i[j] + b12i[j];
      a12MinusA22[i][j] = a12i[j] - a22i[j];
      b21PlusB22[i][j] = b21i[j] + b22i[j];
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
