const fs = require("fs");
const { matrixMultiplicationStrassen } = require("./matrixMultiplication.ts");

// first-try
function firstTry() {
  // const gap = 16;
  // const round = 1;
  // const maxN = 1440;
  // const nList = Array.from(Array(maxN / gap).keys()).map(
  //   (val) => (val + 1) * gap
  // );
  // const tList = [8, 1440]
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

  fs.writeFileSync(
    "report/first-try.js",
    `export default ${JSON.stringify(result)}`
  );
}

function secondTry() {
  const round = 10;
  const n = 512;
  const tList = [
    32, 48, 64, 80, 96, 112, 128, 144, 208, 224, 240, 256, 272, 288, 304, 320,
    336, 352, 368, 384, 400, 416, 432, 448, 464, 480, 496,
  ];
  const result = {
    labels: tList,
    datasets: [{ label: 512, data: [] }],
  };
  // full matrix
  const matrix1 = [...Array(n)].map(() =>
    [...Array(n)].map(() => Math.ceil(Math.random() * 1000))
  );
  const matrix2 = [...Array(n)].map(() =>
    [...Array(n)].map(() => Math.ceil(Math.random() * 1000))
  );
  tList.forEach((t) => {
    let threshold = t;

    let time = 0;
    for (let i = 0; i < round; i++) {
      const strassenWithThresholdStart = performance.now();
      matrixMultiplicationStrassen(n, n, n, matrix1, matrix2, threshold);
      const strassenWithThresholdEnd = performance.now();
      time += strassenWithThresholdEnd - strassenWithThresholdStart;
    }
    result.datasets[0].data.push(time / round);
    console.log(`${t}-${threshold}-${n}-${time / round}`);
  });

  fs.writeFileSync(
    "report/second-try.js",
    `export default ${JSON.stringify(result)}`
  );
}

function thirdTry() {
  const round = 10;
  const nList = [256, 384, 512, 768, 896];
  const tList = [16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112];
  const result = {
    labels: tList,
    datasets: [],
  };
  nList.forEach((n, ni) => {
    // full matrix
    const matrix1 = [...Array(n)].map(() =>
      [...Array(n)].map(() => Math.ceil(Math.random() * 1000))
    );
    const matrix2 = [...Array(n)].map(() =>
      [...Array(n)].map(() => Math.ceil(Math.random() * 1000))
    );
    result.datasets.push({ label: n, data: [] });
    tList.forEach((t) => {
      let threshold = t;

      let time = 0;
      for (let i = 0; i < round; i++) {
        const strassenWithThresholdStart = performance.now();
        matrixMultiplicationStrassen(n, n, n, matrix1, matrix2, threshold);
        const strassenWithThresholdEnd = performance.now();
        time += strassenWithThresholdEnd - strassenWithThresholdStart;
      }
      result.datasets[ni].data.push(time / round);
      console.log(`${t}-${threshold}-${n}-${time / round}`);
    });

    fs.writeFileSync(
      "report/third-try.js",
      `export default ${JSON.stringify(result)}`
    );
  });
}

// firstTry()
// secondTry();
// thirdTry();
