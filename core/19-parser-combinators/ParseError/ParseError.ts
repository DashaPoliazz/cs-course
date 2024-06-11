class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";

    // Maintaining proper stack trace (only available on V8 engines, e.g. Chrome, Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParseError);
    }
  }
}

export default ParseError;
