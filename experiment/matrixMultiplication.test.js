const {
  matrixMultiplicationSimple,
  matrixMultiplicationStrassen,
} = require("./matrixMultiplication.ts");

describe("matrixMultiplicationSimple", () => {
  it("returns correct value", () => {
    const n = 3,
      m = 2,
      p = 4;
    const matrix1 = [
      [1, 5],
      [2, 7],
      [4, 1],
    ];
    const matrix2 = [
      [1, 5, 3, 4],
      [4, 2, 1, 5],
    ];

    const result = matrixMultiplicationSimple(n, m, p, matrix1, matrix2);
    expect(result).toEqual([
      [21, 15, 8, 29],
      [30, 24, 13, 43],
      [8, 22, 13, 21],
    ]);
  });
});

describe("matrixMultiplicationStrassen", () => {
  it("returns correct value", () => {
    const n = 3,
      m = 2,
      p = 4;
    const matrix1 = [
      [1, 5],
      [2, 7],
      [4, 1],
    ];
    const matrix2 = [
      [1, 5, 3, 4],
      [4, 2, 1, 5],
    ];

    const result = matrixMultiplicationStrassen(n, m, p, matrix1, matrix2);
    expect(result).toEqual([
      [21, 15, 8, 29],
      [30, 24, 13, 43],
      [8, 22, 13, 21],
    ]);
  });
  it("returns correct value", () => {
    const n = 2,
      m = 2,
      p = 2;
    const matrix1 = [
      [1, 5],
      [2, 7],
    ];
    const matrix2 = [
      [1, 5],
      [4, 2],
    ];

    const result = matrixMultiplicationStrassen(n, m, p, matrix1, matrix2);
    expect(result).toEqual([
      [21, 15],
      [30, 24],
    ]);
  });
});
