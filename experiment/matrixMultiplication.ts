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

function matrixMultiplicationTypical(
  n: number,
  m: number,
  p: number,
  matrix1: number[][],
  matrix2: number[][]
) {
  if (n === 1 && m === 1 && p === 1) return [[matrix1[0][0] * matrix2[0][0]]];
  const currentN = n > p ? (n % 2 === 0 ? n : n + 1) : p % 2 === 0 ? p : p + 1;
  const result = [...Array(n)].map(() => Array(p).fill(0)); // [n][p]
  const nextN = currentN / 2;

  const a11 = [];
  const a12 = [];
  const a21 = [];
  const a22 = [];
  const b11 = [];
  const b12 = [];
  const b21 = [];
  const b22 = [];
  for (let i = 0; i < nextN; i++) {
    a11.push([]);
    a12.push([]);
    a21.push([]);
    a22.push([]);
    b11.push([]);
    b12.push([]);
    b21.push([]);
    b22.push([]);

    const matrix1i = matrix1[i] || [];
    const matrix2i = matrix2[i] || [];
    const matrix1inextN = matrix1[i + nextN] || [];
    const matrix2inextN = matrix2[i + nextN] || [];
    const a11i = a11[i];
    const a12i = a12[i];
    const a21i = a21[i];
    const a22i = a22[i];
    const b11i = b11[i];
    const b12i = b12[i];
    const b21i = b21[i];
    const b22i = b22[i];
    for (let j = 0; j < nextN; j++) {
      a11i.push(matrix1i[j] || 0);
      a12i.push(matrix1i[j + nextN] || 0);
      a21i.push(matrix1inextN[j] || 0);
      a22i.push(matrix1inextN[j + nextN] || 0);
      b11i.push(matrix2i[j] || 0);
      b12i.push(matrix2i[j + nextN] || 0);
      b21i.push(matrix2inextN[j] || 0);
      b22i.push(matrix2inextN[j + nextN] || 0);
    }
  }

  const a11b11 = matrixMultiplicationTypical(nextN, nextN, nextN, a11, b11);
  const a12b21 = matrixMultiplicationTypical(nextN, nextN, nextN, a12, b21);
  const a11b12 = matrixMultiplicationTypical(nextN, nextN, nextN, a11, b12);
  const a12b22 = matrixMultiplicationTypical(nextN, nextN, nextN, a12, b22);
  const a21b11 = matrixMultiplicationTypical(nextN, nextN, nextN, a21, b11);
  const a22b21 = matrixMultiplicationTypical(nextN, nextN, nextN, a22, b21);
  const a21b12 = matrixMultiplicationTypical(nextN, nextN, nextN, a21, b12);
  const a22b22 = matrixMultiplicationTypical(nextN, nextN, nextN, a22, b22);
  // const a11b11 = matrixMultiplicationSimple(nextN, nextN, nextN, a11, b11);
  // const a12b21 = matrixMultiplicationSimple(nextN, nextN, nextN, a12, b21);
  // const a11b12 = matrixMultiplicationSimple(nextN, nextN, nextN, a11, b12);
  // const a12b22 = matrixMultiplicationSimple(nextN, nextN, nextN, a12, b22);
  // const a21b11 = matrixMultiplicationSimple(nextN, nextN, nextN, a21, b11);
  // const a22b21 = matrixMultiplicationSimple(nextN, nextN, nextN, a22, b21);
  // const a21b12 = matrixMultiplicationSimple(nextN, nextN, nextN, a21, b12);
  // const a22b22 = matrixMultiplicationSimple(nextN, nextN, nextN, a22, b22);

  for (let i = 0; i < nextN; i++) {
    const a11b11i = a11b11[i];
    const a12b21i = a12b21[i];
    const a11b12i = a11b12[i];
    const a12b22i = a12b22[i];
    const a21b11i = a21b11[i];
    const a22b21i = a22b21[i];
    const a21b12i = a21b12[i];
    const a22b22i = a22b22[i];

    const resulti = result[i];
    for (let j = 0; j < nextN; j++) {
      resulti[j] = a11b11i[j] + a12b21i[j];
      const jNextNLessThanp = j + nextN < p;
      const iNextNLessThann = i + nextN < n;
      if (jNextNLessThanp) {
        resulti[j + nextN] = a11b12i[j] + a12b22i[j];
        if (iNextNLessThann)
          result[i + nextN][j + nextN] = a21b12i[j] + a22b22i[j];
      }
      if (iNextNLessThann) result[i + nextN][j] = a21b11i[j] + a22b21i[j];
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
  if (threshold >= currentN) {
    // return matrixMultiplicationSimple(n, m, p, matrix1, matrix2);
    return matrixMultiplicationTypical(n, m, p, matrix1, matrix2);
  }
  const result = [...Array(n)].map(() => Array(p).fill(0));
  const nextN = currentN / 2;

  const a11 = [];
  const a22 = [];
  const b11 = [];
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

    const matrix1i = matrix1[i] || [];
    const matrix2i = matrix2[i] || [];
    const matrix1inextN = matrix1[i + nextN] || [];
    const matrix2inextN = matrix2[i + nextN] || [];
    const a11i = a11[i];
    const a22i = a22[i];
    const b11i = b11[i];
    const b22i = b22[i];

    for (let j = 0; j < nextN; j++) {
      a11i.push(matrix1i[j] || 0);
      const a12ij = matrix1i[j + nextN] || 0;
      const a21ij = matrix1inextN[j] || 0;
      a22i.push(matrix1inextN[j + nextN] || 0);
      b11i.push(matrix2i[j] || 0);
      const b12ij = matrix2i[j + nextN] || 0;
      const b21ij = matrix2inextN[j] || 0;
      b22i.push(matrix2inextN[j + nextN] || 0);

      const a11ij = a11i[j];
      const a22ij = a22i[j];
      const b11ij = b11i[j];
      const b22ij = b22i[j];

      a11PlusA22[i].push(a11ij + a22ij);
      b11PlusB22[i].push(b11ij + b22ij);
      a21PlusA22[i].push(a21ij + a22ij);
      b12MinusB22[i].push(b12ij - b22ij);
      b21MinusB11[i].push(b21ij - b11ij);
      a11PlusA12[i].push(a11ij + a12ij);
      a21MinusA11[i].push(a21ij - a11ij);
      b11PlusB12[i].push(b11ij + b12ij);
      a12MinusA22[i].push(a12ij - a22ij);
      b21PlusB22[i].push(b21ij + b22ij);
    }
  }

  const m1 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a11PlusA22,
    b11PlusB22
  );
  const m2 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a21PlusA22,
    b11,
    threshold || 0
  );
  const m3 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a11,
    b12MinusB22,
    threshold || 0
  );
  const m4 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a22,
    b21MinusB11,
    threshold || 0
  );
  const m5 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a11PlusA12,
    b22,
    threshold || 0
  );
  const m6 = matrixMultiplicationStrassen(
    nextN,
    nextN,
    nextN,
    a21MinusA11,
    b11PlusB12
  );
  const m7 = matrixMultiplicationStrassen(
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
    const resulti = result[i];

    for (let j = 0; j < nextN; j++) {
      resulti[j] = m1i[j] + m4i[j] - m5i[j] + m7i[j];
      const jNextNLessThanp = j + nextN < p;
      const iNextNLessThann = i + nextN < n;
      if (jNextNLessThanp) {
        resulti[j + nextN] = m3i[j] + m5i[j];
        if (iNextNLessThann)
          result[i + nextN][j + nextN] = m1i[j] + m3i[j] - m2i[j] + m6i[j];
      }
      if (iNextNLessThann) result[i + nextN][j] = m2i[j] + m4i[j];
    }
  }
  return result;
}

export {
  matrixMultiplicationSimple,
  matrixMultiplicationStrassen,
  matrixMultiplicationTypical,
};
