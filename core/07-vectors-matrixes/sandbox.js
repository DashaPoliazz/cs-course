const matrix2n2n2 = [
  // 32 bits
  [
    // 16 bits
    [1, 3], // 8 bits
    [2, 4], // 8 bits
  ],
  [
    // 16 bits
    [5, 7], // 8 bits
    [6, 8], // 8 bits
  ],
];

// matrix2n2n2[0][0][0] = 1;
// matrix2n2n2[0][1][0] = 2;
// matrix2n2n2[0][0][1] = 3;
// matrix2n2n2[0][1][1] = 4;

// matrix2n2n2[1][0][0] = 5;
// matrix2n2n2[1][1][0] = 6;
// matrix2n2n2[1][0][1] = 7;
// matrix2n2n2[1][1][1] = 8;

console.log(matrix2n2n2);

const buffer = new ArrayBuffer(8);
const lense = new DataView(buffer);
lense.setUint32(4, 5);
console.log("Buffer:", buffer);
console.log((1488).toString(16));
