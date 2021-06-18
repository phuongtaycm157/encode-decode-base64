const codeBase64 = require("./code_base64");

const splitBinary = (code, width) => {
  const numberOfBinary = Math.ceil(code.length / width);
  let result = [];
  let start = 0;
  for (let i = 0; i < numberOfBinary; i++) {
    let cell = "";
    if (code.length - start < width) {
      const numberOfZero = width - (code.length - start);
      cell += code.slice(start);
      for (let j = 0; j < numberOfZero; j++) {
        cell += "0";
      }
      result.push(cell);
      break;
    }
    cell = code.slice(start, start + width);
    result.push(cell);
    start += width;
  }
  return result;
};

module.exports.encodeBase64 = function (str, callback) {
  const strBuffer = Buffer.from(str);
  let stringCode = "";
  for (let buf of strBuffer) {
    const numberOfZero = 8 - buf.toString(2).length;
    for (let j = 0; j < numberOfZero; j++) {
      stringCode += "0";
    }
    stringCode += buf.toString(2);
  }
  const arrBinary = splitBinary(stringCode, 6);
  const arrCharBase64 = arrBinary.map((b) => {
    const code = codeBase64.find((c) => b.localeCompare(c.binary) === 0);
    return code.char;
  });
  const encode = arrCharBase64.join("") + "=";
  callback(encode);
};

module.exports.decodeBase64 = (encode, callback) => {
  let arrEncode = encode.split("");
  arrEncode.pop();
  const arrBinary = arrEncode.map((b) => {
    const code = codeBase64.find((c) => b.localeCompare(c.char) === 0);
    return code.binary;
  });
  const strDecode = arrBinary.join("");
  let arrDecode = splitBinary(strDecode, 8);
  arrDecode.pop();
  const arrAscii = arrDecode.map((b) => parseInt(b, 2));
  const decode = String.fromCharCode(...arrAscii);
  callback(decode);
};