const { createEncoder, createDecoder } = require("./createEncoderDecoder.js");

const CustomEncoding = require("./encodingFormat.js");

function main() {
  const encodeMapper = (c) => c.charCodeAt();
  const decodeMapper = (code) => String.fromCharCode(code);

  const validChars = [];
  for (let i = 0; i < 128; i++) {
    validChars.push(String.fromCharCode(i));
  }

  const encoder = createEncoder(encodeMapper, validChars);
  const decoder = createDecoder(decodeMapper, validChars);

  // Example of usage:
  const stringToEncode = "\nThis is simple ascii \n encoder";
  const asciiEncoder = new CustomEncoding(encoder, decoder, 8);
  const encodedString = asciiEncoder.encode(stringToEncode);
  console.log("EncodedString: ", encodedString);
  const decodedString = asciiEncoder.decode(encodedString);
  console.log("DecodedString: ", decodedString);
}

main();
