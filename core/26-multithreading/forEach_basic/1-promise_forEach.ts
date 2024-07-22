function forEach<T>(
  iterable: Iterable<T>,
  cb: (value: T) => void,
): Promise<number> {
  return new Promise((resolve) => {
    const start = Date.now();
    // Proreccing itearble
    for (const value of iterable) {
      cb(value);
    }
    // Measuring time
    const end = Date.now();
    const diff = end - start;
    resolve(diff);
  });
}

export default forEach;
