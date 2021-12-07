const fs = require("fs");
const { matrixMultiplicationStrassen } = require("./matrixMultiplication.ts");

// const gap = 16;
// const round = 1;
// const maxN = 1440;
// const nList = Array.from(Array(maxN / gap).keys()).map(
//   (val) => (val + 1) * gap
// );
// const tList = [8, 1440]
// first-try
const gap = 16;
const round = 10;
const maxN = 512;
const nList = Array.from(Array(maxN / gap).keys()).map(
  (val) => (val + 1) * gap
);
const tList = Array.from(Array(maxN / gap + 1).keys()).map(
  (val) => val * gap || 1
);

// const simpleStart = performance.now();
// matrixMultiplicationSimple(n, n, n, matrix1, matrix2);
// const simpleEnd = performance.now();
// console.log("Simple", simpleEnd - simpleStart);

// const strassenStart = performance.now();
// matrixMultiplicationStrassen(n, n, n, matrix1, matrix2, 0);
// const strassenEnd = performance.now();
// console.log("Strassen", strassenEnd - strassenStart);

const result = {
  labels: nList,
  datasets: [],
};

nList.forEach((n) => {
  // full matrix
  const matrix1 = [...Array(n)].map(() =>
    [...Array(n)].map(() => Math.ceil(Math.random() * 1000))
  );
  const matrix2 = [...Array(n)].map(() =>
    [...Array(n)].map(() => Math.ceil(Math.random() * 1000))
  );
  // sparse matrix
  // const matrix1 = [...Array(n)].map((_,i) =>
  //   [...Array(n)].map((_,j) => j-i===0 ? Math.ceil(Math.random() * 1000) : 0)
  // );
  // const matrix2 = [...Array(n)].map((_, i) =>
  //   [...Array(n)].map((_, j) => j-i===0 ? Math.ceil(Math.random() * 1000) : 0)
  // );

  // ["1", "n/64", "n/32", "n/16", "n/8", "n/4", "n/2", "n"].forEach((t, ti) => {
  tList.forEach((t, ti) => {
    if (!result.datasets.some((ds) => ds.label === t))
      result.datasets.push({ label: t, data: [] });

    let threshold = t;
    // if (t === "n") {
    //   threshold = n
    // } else if (t === "1") {
    //   threshold = 1
    // } else {
    //   threshold = parseInt(t.slice(2))
    // }

    let time = 0;
    for (let i = 0; i < round; i++) {
      const strassenWithThresholdStart = performance.now();
      matrixMultiplicationStrassen(n, n, n, matrix1, matrix2, threshold);
      const strassenWithThresholdEnd = performance.now();
      time += strassenWithThresholdEnd - strassenWithThresholdStart;
    }
    result.datasets[ti].data.push(time / round);
    console.log(`${t}-${threshold}-${n}-${time / round}`);
  });
});

fs.writeFileSync("report/data.js", `export default ${JSON.stringify(result)}`);
