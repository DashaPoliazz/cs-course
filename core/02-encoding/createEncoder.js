// mapper should return the number representation of char
const createEncoder = (mapper, validChars) => {
  mapper.validChars = validChars;
  return mapper;
};

module.exports = createEncoder;
