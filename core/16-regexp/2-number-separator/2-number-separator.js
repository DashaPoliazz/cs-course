// Elements in the string are separated
// by separators ; and ,.
// The task is to return the first numerical element of
// each sequence separated by ;.

// "762120,0,22;763827,0,50;750842,0,36;749909,0,95;755884,0,41;"
// 		.split(myRegExp); // ['762120', '763827', '750842', '749909', '755884'] //

module.exports = (str) => {
  const regex = /(?<=^|;)(\d+)/g;
  return str.match(regex);
};
