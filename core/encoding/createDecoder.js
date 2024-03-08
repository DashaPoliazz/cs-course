const createDecoder = (mapper, validChars) => {
  mapper.validChars = validChars;
  return mapper;
};

module.exports = createDecoder;
