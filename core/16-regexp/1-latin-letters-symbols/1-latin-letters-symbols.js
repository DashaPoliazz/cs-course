// The task is to write a regular expression that,
// when tested against a string,
// will return false if the string contains
// characters other than Latin letters, digits, underscore,
// and the dollar sign.

module.exports = (str) => {
  const regex = /[^\w$]/;
  return !regex.test(str);
};
