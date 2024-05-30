const getLength = (iterable) => {
  if (Array.isArray(iterable) || typeof iterable === "string") {
    return iterable.length;
  } else if (iterable instanceof Set || iterable instanceof Map) {
    return iterable.size;
  } else {
    throw new Error("Unsupported iterable type");
  }
};

module.exports = getLength;
