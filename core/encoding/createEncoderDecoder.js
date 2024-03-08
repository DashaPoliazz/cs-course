const createEncoderDecoder = (mapper, validChars) => {
  mapper.validChars = validChars;
  return mapper;
};

const createEncoder = (mapper, validChars) =>
  createEncoderDecoder(mapper, validChars);

const createDecoder = (mapper, validChars) =>
  createEncoderDecoder(mapper, validChars);

module.exports = { createEncoder, createDecoder };
