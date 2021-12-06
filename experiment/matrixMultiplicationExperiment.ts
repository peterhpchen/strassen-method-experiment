const fs = require("fs");
const { matrixMultiplicationStrassen } = require("./matrixMultiplication.ts");
const maxN = 140;
const gap = 10;

// const simpleStart = performance.now();
// matrixMultiplicationSimple(n, n, n, matrix1, matrix2);
// const simpleEnd = performance.now();
// console.log("Simple", simpleEnd - simpleStart);

// const strassenStart = performance.now();
// matrixMultiplicationStrassen(n, n, n, matrix1, matrix2, 0);
// const strassenEnd = performance.now();
// console.log("Strassen", strassenEnd - strassenStart);

let result = {
  labels: Array.from(Array(maxN / 10).keys()).map((val) => val * 10),
  datasets: [],
};
[/*"1", "n/4", "n/2","n3/4",*/ "n"].forEach((t, ti) => {
  result.datasets.push({ label: t, data: [] });
  for (let n = gap; n <= maxN; n += gap) {
    const matrix1 = [...Array(n)].map(() =>
      [...Array(n)].map(() => Math.ceil(Math.random() * 1000))
    );
    const matrix2 = [...Array(n)].map(() =>
      [...Array(n)].map(() => Math.ceil(Math.random() * 1000))
    );

    let threshold = 1;
    if (t === "n/4") {
      threshold = Math.ceil(n / 4);
    } else if (t === "n/2") {
      threshold = Math.ceil(n / 2);
    } else if (t === "n3/4") {
      threshold = Math.ceil((n * 3) / 4);
    } else if (t === "n") {
      threshold = n;
    }

    let time = 0;
    let round = 10;
    for (let i = 0; i < round; i++) {
      const strassenWithThresholdStart = performance.now();
      matrixMultiplicationStrassen(n, n, n, matrix1, matrix2, threshold);
      const strassenWithThresholdEnd = performance.now();
      time += strassenWithThresholdEnd - strassenWithThresholdStart;
    }
    result.datasets[ti].data.push(time / round);
    console.log(`${t}-${n}-${time / round}`);
  }
});

fs.writeFileSync("report/data.js", `export default ${JSON.stringify(result)}`);
