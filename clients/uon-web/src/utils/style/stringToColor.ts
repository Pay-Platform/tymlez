/* eslint-disable no-bitwise */
function makeCRCTable() {
  let c;
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
}

const crcTable = makeCRCTable();

function crc32(str: string): number {
  let crc = 0 ^ -1;
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

export const stringToColor = (str: string): string => {
  const hash = crc32(str);
  const r = `00${(hash & 0xff).toString(16)}`.slice(-2);
  const g = `00${((hash >> 8) & 0xff).toString(16)}`.slice(-2);
  const b = `00${((hash >> 16) & 0xff).toString(16)}`.slice(-2);
  return `#${r}${g}${b}`;
};
